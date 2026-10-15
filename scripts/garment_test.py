#!/usr/bin/env python3
"""Clothes VTO real end-to-end gate test.
Docs: docs.perfectcorp.com/reference/ai_clothes
Flow: POST /s2s/v2.0/file/cloth-v3 -> PUT bytes -> POST /s2s/v2.0/task/cloth-v4
     with garment_category; poll GET /task/cloth-v4/<task_id>
     until success; save result image + log units."""
import os, sys, json, time, requests
from pathlib import Path

BASE = "https://yce-api-01.makeupar.com/s2s/v2.0"
KEY = os.environ.get("YOUCAM_API_KEY", "")
HEADERS = {"Authorization": f"Bearer {KEY}"}
OUT = Path("out/garment_test")
OUT.mkdir(parents=True, exist_ok=True)

def log(msg): print(msg); sys.stdout.flush()

def upload_file(path: Path):
    """POST /file/cloth-v3 -> returns file_id + presigned PUT url."""
    url = f"{BASE}/file/cloth-v3"
    data = {"file_name": path.name, "file_size": path.stat().st_size}
    with open(path, "rb") as f:
        r = requests.post(url, headers=HEADERS, data={"data": json.dumps(data)}, files={"file": f})
    r.raise_for_status()
    body = r.json()
    file_id = body["data"]["file_id"]
    put_url = body["data"]["upload_url"]
    requests.put(put_url, headers={"Authorization": HEADERS["Authorization"]}, data=open(path, "rb").read())
    return file_id

def submit_task(src_id: str, ref_id: str, garment_cat: str):
    payload = {
        "src_file_id": src_id,
        "ref_file_id": ref_id,
        "garment_category": garment_cat,
        "format": "json",
    }
    r = requests.post(f"{BASE}/task/cloth-v4", headers=HEADERS, json=payload)
    r.raise_for_status()
    return r.json()["data"]["task_id"]

def poll(task_id: str, timeout=180):
    start = time.time()
    while time.time() - start < timeout:
        r = requests.get(f"{BASE}/task/cloth-v4/{task_id}", headers=HEADERS)
        r.raise_for_status()
        j = r.json()
        if j.get("data", {}).get("task_status") == "success":
            return j
        time.sleep(3)
    raise TimeoutError("VTO timed out")

def save_image(url: str, name: str) -> Path:
    r = requests.get(url)
    r.raise_for_status()
    p = OUT / name
    p.write_bytes(r.content)
    return p

def main():
    if not KEY:
        sys.exit(f"MISSING YOUCAM_API_KEY env var. Set it, then rerun.")

    garments = {
        "saree": ("saree.png", "ethnic"),
        "kurta_set": ("kurta_set.png", "full_body"),
        "lehenga_ethnic": ("lehenga_ethnic.png", "full_body"),
        "western_dress": ("western_dress.png", "full_body"),
    }
    user = OUT / "user_fullbody.jpg"
    if not user.exists():
        sys.exit(f"MISSING: {user}")

    src_id = upload_file(user)
    for key, (fname, cat) in garments.items():
        ref = OUT / fname
        if not ref.exists():
            log(f"SKIP: {key} ({fname} missing)")
            continue
        log(f"RENDER: {key} | category={cat}")
        ref_id = upload_file(ref)
        tid = submit_task(src_id, ref_id, cat)
        try:
            j = poll(tid)
            img_url = j["data"]["results"]["url"]
            out_path = save_image(img_url, f"{key}_result.png")
            log(f"OK: {key} -> {out_path}")
        except Exception as e:
            log(f"FAIL: {key} -> {e}")

if __name__ == "__main__":
    main()
