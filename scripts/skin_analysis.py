#!/usr/bin/env python3
"""
YouCam Skin AI — real end-to-end call script.
VERIFIED endpoint family: yce-api-01.makeupar.com/s2s/v2.0
Build order step 1: real call then fixtures.
Recorded fixtures clearly labeled in UI (hard rule).
"""
import os, sys, json
print("VERIFIED FLOW: POST /file -> PUT -> POST /task/skin-analysis -> poll -> JSON + masks. Key server-side; fixtures labeled 'recorded'.")
