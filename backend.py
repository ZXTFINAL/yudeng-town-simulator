#!/usr/bin/env python3
"""Loopback-only persistence API for the Yudeng Town simulator."""
from __future__ import annotations

import json
import os
import tempfile
import threading
import uuid
import urllib.error
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
STORE_PATH = DATA_DIR / "towns.json"
LOCK = threading.RLock()
MAX_BODY_BYTES = 20 * 1024 * 1024

WORLD_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["worldName", "regionName", "summary", "history", "geography", "outside", "soil", "road", "marketPrice", "riskLevel", "residents", "extraFacilities"],
    "properties": {
        "worldName": {"type": "string"}, "regionName": {"type": "string"},
        "summary": {"type": "string"}, "history": {"type": "string"},
        "geography": {"type": "string"}, "outside": {"type": "string"},
        "soil": {"type": "string", "enum": ["fertile", "normal", "poor"]},
        "road": {"type": "string", "enum": ["open", "limited", "blocked"]},
        "marketPrice": {"type": "integer", "minimum": 0, "maximum": 3},
        "riskLevel": {"type": "string", "enum": ["calm", "normal", "high"]},
        "residents": {"type": "array", "items": {
            "type": "object", "additionalProperties": False,
            "required": ["name", "role", "goal", "background", "personality", "mbti", "zodiac", "gender", "age", "alignment", "jobType", "signatureSkill"],
            "properties": {
                "name": {"type": "string"}, "role": {"type": "string"}, "goal": {"type": "string"},
                "background": {"type": "string"}, "personality": {"type": "string"},
                "mbti": {"type": "string", "enum": ["ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP","ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ"]},
                "zodiac": {"type": "string", "enum": ["白羊座","金牛座","双子座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座","摩羯座","水瓶座","双鱼座"]},
                "gender": {"type": "string", "enum": ["女","男"]}, "age": {"type": "integer", "minimum": 18, "maximum": 70},
                "alignment": {"type": "integer", "minimum": -90, "maximum": 90},
                "jobType": {"type": "string", "enum": ["office","school","clinic","market","cafe","restaurant","farm","petshop","park","fishing","training","townhall","police","prosecutor","courthouse","prison"]},
                "signatureSkill": {"type": "string"}
            }
        }},
        "extraFacilities": {"type": "array", "items": {
            "type": "object", "additionalProperties": False,
            "required": ["type", "x", "y", "rotation"],
            "properties": {
                "type": {"type": "string", "enum": ["farm","restaurant","cafe","market","training","fishing","toilet","park","school","clinic","office","petshop"]},
                "x": {"type": "integer", "minimum": 0, "maximum": 9}, "y": {"type": "integer", "minimum": 0, "maximum": 5},
                "rotation": {"type": "integer", "enum": [0,90,180,270]}
            }
        }}
    }
}


def decide_agent_action_with_openai(options):
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("OpenAI API key is not configured on the backend.")
    model = os.environ.get("OPENAI_MODEL", "gpt-6-astra").strip() or "gpt-6-astra"
    agent_id = cleaned_text(options.get("agentId"), 80, "resident")
    system_prompt = str(options.get("systemPrompt") or "").strip()[:24000]
    context = options.get("context") if isinstance(options.get("context"), dict) else {}
    choices = options.get("actions") if isinstance(options.get("actions"), list) else []
    choices = [item for item in choices[:24] if isinstance(item, dict) and item.get("id") and item.get("label")]
    if not system_prompt or not choices:
        raise ValueError("角色系统提示词与候选行动不能为空。");
    choice_ids = [cleaned_text(item.get("id"), 48, "") for item in choices]
    if len(set(choice_ids)) != len(choice_ids):
        raise ValueError("候选行动 id 必须唯一。");
    schema = {
        "type": "object", "additionalProperties": False, "required": ["choiceId", "thought"],
        "properties": {
            "choiceId": {"type": "string", "enum": choice_ids},
            "thought": {"type": "string"},
        },
    }
    payload = {
        "model": model,
        "instructions": system_prompt + "\n\n你只能从本轮候选行动中选择一个。遵守行动前提和现有工具权限，不要虚构已完成的事。thought 用第一人称写一句具体、贴合背景与当前情绪的行动想法。",
        "input": json.dumps({"agentId": agent_id, "worldContext": context, "candidateActions": [{"id": choice_ids[index], "label": cleaned_text(item.get("label"), 160, "日常行动")} for index, item in enumerate(choices)]}, ensure_ascii=False),
        "text": {"format": {"type": "json_schema", "name": "agent_turn_action", "strict": True, "schema": schema}},
        "max_output_tokens": 180,
        "store": False,
    }
    request = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            result = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        raise RuntimeError(f"OpenAI Responses API returned HTTP {error.code}.") from None
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        raise RuntimeError("Could not complete the resident action request.") from None
    output_text = "".join(
        content.get("text", "")
        for item in result.get("output", []) if item.get("type") == "message"
        for content in item.get("content", []) if content.get("type") == "output_text"
    )
    try:
        decision = json.loads(output_text)
    except json.JSONDecodeError:
        raise RuntimeError("The model returned an invalid resident action.") from None
    if decision.get("choiceId") not in choice_ids:
        raise RuntimeError("The model selected an action outside the allowed choices.")
    usage = result.get("usage") or {}
    return {
        "agentId": agent_id,
        "choiceId": decision["choiceId"],
        "thought": cleaned_text(decision.get("thought"), 220, "我先照顾眼前最重要的事，再继续自己的计划。"),
        "usage": {
            "inputTokens": max(0, int(usage.get("input_tokens", 0))),
            "outputTokens": max(0, int(usage.get("output_tokens", 0))),
            "totalTokens": max(0, int(usage.get("total_tokens", 0))),
        },
        "model": model,
    }


def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def cleaned_text(value, limit, default):
    text = " ".join(str(value or "").split())
    return (text[:limit] or default)


def generate_world_with_openai(options):
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("OpenAI API key is not configured on the backend.")
    model = os.environ.get("OPENAI_MODEL", "gpt-6-astra").strip() or "gpt-6-astra"
    population = max(8, min(14, int(options.get("population", 10))))
    name_hint = cleaned_text(options.get("nameHint"), 32, "")
    region_hint = cleaned_text(options.get("regionHint"), 48, "")
    prompt = (
        "为一个社会模拟器初始化一座可持续运行的小镇。生成内容必须符合JSON Schema。"
        f"居民人数必须是{population}人；全部是彼此不同的成年角色，善恶立场要混合，至少2人道德值低于-25、至少3人高于25。"
        "每个人要有可信且彼此不同的背景、职业、具体人生目标、性格、MBTI、星座和一项熟练度特长。"
        "职业必须适配所选的标准建筑模板。故事可包含债务、住房竞争、利益冲突、治安风险、合作与公共服务，不要把每个人写成善人或恶人。"
        "小镇地图是10×6；townhall、警务室、检察院、法院、监狱和基础街区已由游戏模板提供。"
        "extraFacilities只规划0到6座额外标准设施；尽量放在x≥8或y≥4的空白扩展区，避免地图核心已有建筑；坐标使用从0开始的整数。"
        "环境参数必须构成真实约束，例如道路受限、土壤贫瘠或物价偏高。"
        f"小镇名称提示：{name_hint or '自由生成'}。周边地区提示：{region_hint or '自由生成'}。"
    )
    payload = {
        "model": model,
        "instructions": "你是社会模拟器的世界初始化器。只产出可玩的设定和居民资料，不生成代码，不忽略指定人数与职业约束。",
        "input": prompt,
        "text": {"format": {"type": "json_schema", "name": "town_world", "strict": True, "schema": WORLD_SCHEMA}},
        "max_output_tokens": 6500,
        "store": False,
    }
    request = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            result = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        raise RuntimeError(f"OpenAI Responses API returned HTTP {error.code}.") from None
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        raise RuntimeError("Could not complete the OpenAI world-generation request.") from None

    output_text = "".join(
        content.get("text", "")
        for item in result.get("output", []) if item.get("type") == "message"
        for content in item.get("content", []) if content.get("type") == "output_text"
    )
    if not output_text:
        raise RuntimeError("The model did not return structured world content.")
    try:
        generated = json.loads(output_text)
    except json.JSONDecodeError:
        raise RuntimeError("The model returned invalid structured world content.") from None
    residents = generated.get("residents") if isinstance(generated, dict) else None
    if not isinstance(residents, list) or len(residents) < 8:
        raise RuntimeError("The generated world did not include at least 8 residents.")
    residents = residents[:population]
    normalized = {
        "worldName": cleaned_text(generated.get("worldName"), 24, "新河镇"),
        "regionName": cleaned_text(generated.get("regionName"), 28, "邻近县城"),
        "summary": cleaned_text(generated.get("summary"), 220, "居民带着不同的目标来到这里。"),
        "history": cleaned_text(generated.get("history"), 1200, "小镇正经历新一轮变化。"),
        "geography": cleaned_text(generated.get("geography"), 650, "周围有河岸、旧道路和可供发展的空地。"),
        "outside": cleaned_text(generated.get("outside"), 650, "邻近地区的道路、物价和治安会影响小镇。"),
        "soil": generated.get("soil") if generated.get("soil") in {"fertile", "normal", "poor"} else "normal",
        "road": generated.get("road") if generated.get("road") in {"open", "limited", "blocked"} else "open",
        "marketPrice": max(0, min(3, int(generated.get("marketPrice", 1)))),
        "riskLevel": generated.get("riskLevel") if generated.get("riskLevel") in {"calm", "normal", "high"} else "normal",
        "residents": [], "extraFacilities": [],
    }
    valid_jobs = {"office","school","clinic","market","cafe","restaurant","farm","petshop","park","fishing","training","townhall","police","prosecutor","courthouse","prison"}
    valid_mbti = {"ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP","ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ"}
    valid_zodiac = {"白羊座","金牛座","双子座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座","摩羯座","水瓶座","双鱼座"}
    seen_names = set()
    for index, resident in enumerate(residents):
        if not isinstance(resident, dict):
            continue
        name = cleaned_text(resident.get("name"), 16, f"居民{index + 1}")
        if name in seen_names:
            name = f"{name}{index + 1}"
        seen_names.add(name)
        normalized["residents"].append({
            "name": name,
            "role": cleaned_text(resident.get("role"), 26, "新居民"),
            "goal": cleaned_text(resident.get("goal"), 96, "在镇上找到稳定的生活方向"),
            "background": cleaned_text(resident.get("background"), 520, "带着一段过往来到小镇，希望重新开始。"),
            "personality": cleaned_text(resident.get("personality"), 100, "谨慎、好奇"),
            "mbti": resident.get("mbti") if resident.get("mbti") in valid_mbti else "ISFJ",
            "zodiac": resident.get("zodiac") if resident.get("zodiac") in valid_zodiac else "金牛座",
            "gender": resident.get("gender") if resident.get("gender") in {"女", "男"} else "女",
            "age": max(18, min(70, int(resident.get("age", 28)))),
            "alignment": max(-90, min(90, int(resident.get("alignment", 0)))),
            "jobType": resident.get("jobType") if resident.get("jobType") in valid_jobs else "office",
            "signatureSkill": cleaned_text(resident.get("signatureSkill"), 32, "communication"),
        })
    facility_types = {"farm","restaurant","cafe","market","training","fishing","toilet","park","school","clinic","office","petshop"}
    for item in (generated.get("extraFacilities") or [])[:6]:
        if not isinstance(item, dict) or item.get("type") not in facility_types:
            continue
        normalized["extraFacilities"].append({
            "type": item["type"], "x": max(0, min(9, int(item.get("x", 8)))),
            "y": max(0, min(5, int(item.get("y", 4)))),
            "rotation": item.get("rotation") if item.get("rotation") in {0, 90, 180, 270} else 0,
        })
    usage = result.get("usage") or {}
    return normalized, {
        "model": model,
        "inputTokens": max(0, int(usage.get("input_tokens", 0))),
        "outputTokens": max(0, int(usage.get("output_tokens", 0))),
        "totalTokens": max(0, int(usage.get("total_tokens", 0))),
    }


def load_store():
    if not STORE_PATH.exists():
        return {"schemaVersion": 1, "towns": {}}
    try:
        value = json.loads(STORE_PATH.read_text(encoding="utf-8"))
        if isinstance(value, dict) and isinstance(value.get("towns"), dict):
            value.setdefault("schemaVersion", 1)
            return value
    except (OSError, json.JSONDecodeError):
        pass
    return {"schemaVersion": 1, "towns": {}}


def save_store(store):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(prefix="towns-", suffix=".tmp", dir=str(DATA_DIR))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(store, handle, ensure_ascii=False, separators=(",", ":"))
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_name, STORE_PATH)
    finally:
        try:
            os.unlink(temp_name)
        except FileNotFoundError:
            pass


def town_summary(town):
    state = town.get("state") or {}
    return {
        "id": town["id"],
        "name": town.get("name") or state.get("worldName") or "未命名小镇",
        "createdAt": town.get("createdAt"),
        "updatedAt": town.get("updatedAt"),
        "revision": town.get("revision", 0),
        "day": state.get("day", 1),
        "residents": len(state.get("residents") or []),
        "buildings": len(state.get("buildings") or []),
    }


class Handler(BaseHTTPRequestHandler):
    server_version = "YudengTownBackend/0.1"

    def log_message(self, fmt, *args):
        print("[town-api] " + fmt % args)

    def _headers(self, status=200, content_type="application/json; charset=utf-8"):
        origin = self.headers.get("Origin", "")
        allowed = {"http://localhost:4173", "http://127.0.0.1:4173", "http://localhost:8000", "http://127.0.0.1:8000"}
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", origin if origin in allowed else "http://localhost:4173")
        self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

    def _send(self, value, status=200):
        payload = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self._headers(status)
        self.wfile.write(payload)

    def _body(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length < 0 or length > MAX_BODY_BYTES:
            raise ValueError("请求内容超过 20 MB 上限。")
        raw = self.rfile.read(length)
        if not raw:
            return {}
        value = json.loads(raw.decode("utf-8"))
        if not isinstance(value, dict):
            raise ValueError("请求必须是 JSON 对象。")
        return value

    def do_OPTIONS(self):
        self._headers(204)

    def do_GET(self):
        path = urlparse(self.path).path.rstrip("/")
        if path == "/api/health":
            self._send({"ok": True, "service": "yudeng-town-backend", "store": "json-file", "openaiConfigured": bool(os.environ.get("OPENAI_API_KEY")), "modelConfigured": bool(os.environ.get("OPENAI_MODEL")), "model": os.environ.get("OPENAI_MODEL") or "gpt-6-astra"})
            return
        with LOCK:
            store = load_store()
            if path == "/api/towns":
                towns = sorted(store["towns"].values(), key=lambda item: item.get("updatedAt") or "", reverse=True)
                self._send({"towns": [town_summary(item) for item in towns]})
                return
            if path.startswith("/api/towns/"):
                town_id = unquote(path.split("/", 3)[3])
                town = store["towns"].get(town_id)
                if not town:
                    self._send({"error": "town_not_found"}, 404)
                    return
                self._send(town)
                return
        self._send({"error": "not_found"}, 404)

    def do_POST(self):
        path = urlparse(self.path).path.rstrip("/")
        if path == "/api/agents/decide":
            if not os.environ.get("OPENAI_API_KEY", "").strip():
                self._send({"error": "openai_not_configured", "message": "请在启动后端的环境中设置 OPENAI_API_KEY；密钥只读取自服务端环境变量。"}, 503)
                return
            try:
                self._send(decide_agent_action_with_openai(self._body()))
            except (ValueError, json.JSONDecodeError) as error:
                self._send({"error": "invalid_request", "message": str(error)}, 400)
            except RuntimeError as error:
                self._send({"error": "agent_decision_failed", "message": str(error)}, 502)
            return
        if path == "/api/worlds/generate":
            if not os.environ.get("OPENAI_API_KEY", "").strip():
                self._send({"error": "openai_not_configured", "message": "请在启动后端的环境中设置 OPENAI_API_KEY；密钥只读取自服务端环境变量。"}, 503)
                return
            try:
                options = self._body()
                world, usage = generate_world_with_openai(options)
                self._send({"world": world, "usage": usage}, 201)
            except (ValueError, json.JSONDecodeError) as error:
                self._send({"error": "invalid_request", "message": str(error)}, 400)
            except RuntimeError as error:
                self._send({"error": "world_generation_failed", "message": str(error)}, 502)
            return
        if path != "/api/towns":
            self._send({"error": "not_found"}, 404)
            return
        try:
            body = self._body()
            state = body.get("state")
            if not isinstance(state, dict) or not isinstance(state.get("residents"), list) or not isinstance(state.get("buildings"), list):
                self._send({"error": "invalid_town_state"}, 400)
                return
            name = str(body.get("name") or state.get("worldName") or "新小镇").strip()[:48] or "新小镇"
            town_id = "town-" + uuid.uuid4().hex[:12]
            state["worldId"] = town_id
            state["worldName"] = name
            town = {"id": town_id, "name": name, "createdAt": now_iso(), "updatedAt": now_iso(), "revision": 1, "state": state}
            with LOCK:
                store = load_store()
                store["towns"][town_id] = town
                save_store(store)
            self._send(town, 201)
        except (ValueError, json.JSONDecodeError) as error:
            self._send({"error": "invalid_request", "message": str(error)}, 400)

    def do_PUT(self):
        path = urlparse(self.path).path.rstrip("/")
        if not path.startswith("/api/towns/"):
            self._send({"error": "not_found"}, 404)
            return
        town_id = unquote(path.split("/", 3)[3])
        try:
            body = self._body()
            state = body.get("state")
            if not isinstance(state, dict) or not isinstance(state.get("residents"), list) or not isinstance(state.get("buildings"), list):
                self._send({"error": "invalid_town_state"}, 400)
                return
            name = str(body.get("name") or state.get("worldName") or "榆灯镇").strip()[:48] or "榆灯镇"
            with LOCK:
                store = load_store()
                previous = store["towns"].get(town_id)
                created = previous.get("createdAt") if previous else now_iso()
                state["worldId"] = town_id
                state["worldName"] = name
                town = {"id": town_id, "name": name, "createdAt": created, "updatedAt": now_iso(), "revision": (previous.get("revision", 0) if previous else 0) + 1, "state": state}
                store["towns"][town_id] = town
                save_store(store)
            self._send(town)
        except (ValueError, json.JSONDecodeError) as error:
            self._send({"error": "invalid_request", "message": str(error)}, 400)


def main():
    host = os.environ.get("TOWN_BACKEND_HOST", "127.0.0.1")
    port = int(os.environ.get("TOWN_BACKEND_PORT", "4174"))
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"榆灯镇后端已启动: http://{host}:{port}  (仅本机访问)")
    server.serve_forever()


if __name__ == "__main__":
    main()
