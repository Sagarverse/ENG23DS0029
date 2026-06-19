import urllib.request
import json
from datetime import datetime

# API Constants
AUTH_URL = "http://4.224.186.213/evaluation-service/auth"
NOTIFICATIONS_URL = "http://4.224.186.213/evaluation-service/notifications"

# User Credentials
CREDENTIALS = {
    "email": "eng23ds0029@dsu.edu.in",
    "name": "SAGAR M",
    "rollNo": "ENG23DS0029",
    "accessCode": "BgWZSW",
    "clientID": "35240c1c-8038-467f-b86c-fdf913092a06",
    "clientSecret": "KCktYreVazKGepSw"
}

def get_auth_token():
    """Authenticates with the API and returns the access token."""
    try:
        req = urllib.request.Request(
            AUTH_URL,
            data=json.dumps(CREDENTIALS).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode("utf-8"))
            return data["access_token"]
    except Exception as e:
        print(f"Error authenticating: {e}")
        return None

def fetch_notifications(token):
    """Fetches all notifications from the API using the Bearer token."""
    try:
        req = urllib.request.Request(
            NOTIFICATIONS_URL,
            headers={"Authorization": f"Bearer {token}"},
            method="GET"
        )
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode("utf-8"))
            return data.get("notifications", [])
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        return []

def calculate_priority_score(notification):
    """
    Computes priority weight for sorting.
    Placement = 3, Result = 2, Event = 1.
    Returns a tuple (weight, timestamp_epoch) for sorting.
    """
    type_weights = {"Placement": 3, "Result": 2, "Event": 1}
    n_type = notification.get("Type", "Event")
    weight = type_weights.get(n_type, 1)
    
    timestamp_str = notification.get("Timestamp", "")
    try:
        # Expected format: "YYYY-MM-DD HH:MM:SS"
        dt = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")
        timestamp_epoch = dt.timestamp()
    except Exception:
        timestamp_epoch = 0
        
    return (weight, timestamp_epoch)

def main():
    print("--- Stage 1: Priority Inbox Standalone Script ---")
    print("Fetching auth token...")
    token = get_auth_token()
    if not token:
        print("Failed to obtain auth token. Exiting.")
        return
        
    print("Fetching notifications from API...")
    notifications = fetch_notifications(token)
    print(f"Total notifications fetched: {len(notifications)}")
    
    # Sort notifications by:
    # 1. Weight descending (Placement > Result > Event)
    # 2. Recency descending (most recent first)
    sorted_notifications = sorted(
        notifications,
        key=calculate_priority_score,
        reverse=True
    )
    
    top_10 = sorted_notifications[:10]
    
    print("\nTop 10 Priority Notifications:")
    print("=" * 80)
    for idx, n in enumerate(top_10, 1):
        print(f"{idx:02d}. [{n['Type']}] (Recency: {n['Timestamp']})")
        print(f"    Message: {n['Message']}")
        print(f"    ID:      {n['ID']}")
        print("-" * 80)
        
    # Output to JSON file as required
    output_data = {"top_10_priority_notifications": top_10}
    with open("priority_notifications_output.json", "w") as f:
        json.dump(output_data, f, indent=2)
    print("\nSaved top 10 priority notifications to 'priority_notifications_output.json'")

if __name__ == "__main__":
    main()
