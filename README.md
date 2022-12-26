### Welcome to the Client Mod Badges API!

This is a simple API that allows you to retrieve the badges of a user for various Discord clients such as BetterDiscord, Enmity, and Vencord. The badges are stored as JSON files in the users directory, with the user ID as the file name.

To get the badges for a user, simply make a GET request to the /users endpoint with the user ID as a query parameter:

```shell
GET https://clientmodbadges-api.herokuapp.com/users?user=354191516979429376
```
The response will be a JSON object with the user's badges:

```json
{
  "enmity": [
    "supporter"
  ],
  "velocity": [
    "Translator (de)"
  ]
}
```
If the user has no badges or the user ID is invalid, the response will be an empty object.

I hope you find this API useful! If you have any questions or issues, please don't hesitate to open an issue on this repository.

---
README generated by ChatGPT because im lazy