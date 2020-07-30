# Engine - Frontend communication

## Purpose

This document contains "schemas" for each message that can be sent through the websocket.

## Frontend -> Engine

```
# Websocket Event: ClientReady
# ----------------------------

# Signals that the client is ready
{
    "token": "[token for the given machine]"
}
```

```
# Websocket Event: ClientEvent
# ----------------------------

# Reset machine
{
    "name": "Reset",
    "token": "[token for the given machine]"
}

# Enter a flow
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "enterFlow",
    "data": {
        "flow": "[checkOutItems|checkInItems|status]"
    }
}

# Login
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "login",
    "data": {
        "username": "[username]",
        "password": "[password|null]"
    }
}

# Check out an item (borrow from the library)
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "checkOutItem",
    "data": {
        "itemIdentifier": "[item code]"
    }
}

# Check in an item (return to the library)
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "checkÍnItem",
    "data": {
        "itemIdentifier": "[item code]"
    }
}
```

## Engine -> Frontend

```
# Websocket Event: UpdateState
# ----------------------------

# The object contains the new machine state for the client.

# Initial
{
    "step": "initial"
}

# Login scan
{
    "step": "loginScan",
    "flow": "[the flow the user is in: checkInItems, checkOutItems, status]",
    "error": "[if a login attempt failed]"
}

# Check out an item (borrow from the library)
{
    "flow": "checkOutItems",
    "step": "checkOutItems",
    "user": {
        "name": "[First name of user]",
        "birthdayToday": "[is it the user's birthday today]"
    },
    "items": [
       {
            "itemIdentifier": "[item identifier]",
            "title": "[item title]",
            "author": "[item author]",
            "renewalOk": "[if already checked out by user, is it renewed]",
            "message": "[message about check out]"
       },
       ...
    ]
}

# Check in an item (return to the library)
{
    "flow": "checkInItems",
    "step": "checkInItems",
    "items": [
       {
            "itemIdentifier": "[item identifier]",
            "title": "[item title]",
            "author": "[item author]",
            "message": "[message about check in]"
       },
       ...
    ]
}
```