# tests/test_users.py
from app.schemas.user import UserCreate
from app.controllers import user as crud

def test_create_user(db):
    user_data = UserCreate(email="testuser@example.com", username="testuser", password="testpass")
    user = crud.create_user(db, user_data)
    
    assert user.email == "testuser@example.com"
    assert user.username == "testuser"
    assert user.hashed_password != "testpass"  # Password should be hashed

def test_get_user_by_email(db):
    user_data = UserCreate(email="testuser@example.com", username="testuser", password="testpass")
    crud.create_user(db, user_data)
    user = crud.get_user_by_email(db, "testuser@example.com")
    
    assert user is not None
    assert user.email == "testuser@example.com"

# New integration tests
def test_create_user_api(client):
    response = client.post(
        "/users/",
        json={"email": "newuser@example.com", "username": "newuser", "password": "newpass"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["username"] == "newuser"

def test_create_user_duplicate_email(client, db):
    user_data = UserCreate(email="testuser@example.com", username="testuser", password="testpass")
    crud.create_user(db, user_data)
    
    response = client.post(
        "/users/",
        json={"email": "testuser@example.com", "username": "testuser2", "password": "testpass"}
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already registered"}
