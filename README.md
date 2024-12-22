# FollowComp

FollowComp is a [Chrome extension](https://chromewebstore.google.com/category/extensions?hl=en) that can be used to view the users you follow that don't follow you back.

## Documentation :

- `manifest.json` : Configuration file for the extension

- popup :

  - `popup.html` : User interface to use the extension
  - `popup.js` : Script to launch the main script

- scripts :

  - `content.js` : Main script, gets and compare the data
  - `background.js` : Not used actually, may be useful for future updates

- images :

  - contains icon for the extension (16x16, 32x32, 48x48, 128x128)

---

## Credits :

The code used for the script used in `scripts/content.js` was greatly inspired by [this message](https://stackoverflow.com/a/74133719) on StackOverflow.

---

By [julesr0y](https://julesr0y.xyz/)

```
________ _______ __  __       _________        ______
___  __ \__  __ \_ \/ /       ______  /____  _____  /_____ ________
__  /_/ /_  / / /__  /        ___ _  / _  / / /__  / _  _ \__  ___/
_  _, _/ / /_/ / _  /         / /_/ /  / /_/ / _  /  /  __/_(__  )
/_/ |_|  \____/  /_/          \____/   \__,_/  /_/   \___/ /____/
```
