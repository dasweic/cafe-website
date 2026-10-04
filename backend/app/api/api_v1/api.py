from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, categories, menu_items, gallery, staff, settings, upload

api_router = APIRouter()

# Auth routes
api_router.include_router(auth.router, tags=["login"])

# Cafe Core routes
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(menu_items.router, prefix="/menu-items", tags=["menu items"])
api_router.include_router(gallery.router, prefix="/gallery", tags=["gallery"])
api_router.include_router(staff.router, prefix="/staff", tags=["staff"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])

# Utility routes
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])