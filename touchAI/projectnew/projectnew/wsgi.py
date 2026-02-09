"""
WSGI config for projectnew project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
from pathlib import Path

from django.core.wsgi import get_wsgi_application

# Load .env if present
try:
	from dotenv import load_dotenv
	env_path = Path(__file__).resolve().parents[1] / ".env"
	if env_path.exists():
		load_dotenv(env_path)
except Exception:
	pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projectnew.settings')

application = get_wsgi_application()
