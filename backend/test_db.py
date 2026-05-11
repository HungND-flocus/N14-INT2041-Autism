import asyncio
from sqlmodel import select
from app.core.database import engine, get_session
from app.models.profile import Profile

async def test_connection():
    print("Testing connection to Supabase PostgreSQL...")
    try:
        async for session in get_session():
            # Try to fetch one profile
            statement = select(Profile).limit(1)
            result = await session.execute(statement)
            profile = result.scalars().first()
            
            if profile:
                print(f"✅ Success! Connected and found profile: {profile.full_name}")
            else:
                print("✅ Success! Connected, but no profiles found in the database.")
                
    except Exception as e:
        print(f"❌ Connection failed: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_connection())
