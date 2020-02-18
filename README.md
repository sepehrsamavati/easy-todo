# Easy ToDo
Easy ToDo / Open-source Javascript todo list
### [hmht.ir/todo](http://hmht.ir/page/todo)

# User guide
## *Simple usage*
If you're new to the app:
+ When you open the app, it asks your name. Enter your name or 'Skip'. You can change it later without any limits.
+ Now tap on the box at the bottom of screen. You can add tasks here; Tap, Type, Enter. It's optional to select a card color or not, you can change it later.
+ Every card has two buttons. Check them or sort them. Tap to check. Tap, hold and move card to sort.
That was the newbie guide.

## *Advanced usage*
### View cards
Tap on a card to see more details about it.

### Edit task title
Tap on the card, tap 'Edit card'. Now edit from the bottom input field.

### Edit task color
Tap on the card, tap 'Edit card'. Just tap on the color you want.

### Lock cards
Tap on the card, tap 'Edit card', tap 'Add/Edit password'. Now You're in password mode. There are 3 types of commands; Fully lock the card, lock sort and check button, remove lock.
+ Tap and enter 1 [Space] (the keyboard) or the word 'null' to unlock
+ Enter [Dot] (from keyboard) (the character '.') to lock card buttons
+ Enter anything except [Space] ' ' [Dot] '.' and 'null' to lock the cards and hide it's text

### Rename account
Open menu, tap on the profile icon (top right).







## Menu and buttons

### Undo
Bring the done cards back (Stores up to 10).
Text and color remains but card date will be refreshed.

### Column
Switch between 1 or 2 card(s) in a row.

### Direction
Switch between ltr (e.g. English) or rtl (e.g. Persian) direction.

### Master password
You need to set a master password to lock a card, unlock all cards, export (backup) data. **DON'T** forget the password; It's not easy to recover data except if you know about JSON and a little JS.

### Change theme
Changes app theme and cards default color (when adding new task).

### Reverse sort / Sort by color / Sort by date
Sorts the cards.

### Import data
Import and exported data. You need to enter the file's master password (new data master password).

### Export data
Exports data (mostly used as a back-up) that can be imported to app. You need to have a master password to do this operation.

### Unlock all
Unlock all locked cards (if exists).

### Selector
You can select cards with selector tool and check them or change their label color.
Select your cards and tap on the input field for more. To exit selector mode simply just open/close menu or tap on input and close message box.

### Check all
Check all cards with transition/animation (400ms delay).

### Reset data
Reset you data completely.



# Developer guide
## Developer mode
Rename your account to 'Developer' to get extra buttons on your menu.


## Coding on source

***There's a little spaghetti code***

### Modes
DB.mode details

**-1** Used as null and canceled operation\
**0** Add card\
**1** Startup name input\
**2** Reset DB\
**3** Check all cards\
**4** empty - nothing\
**5** Changing name\
**6** Editing card\
**7** Unlocking card\
**8** Remove/Change/Add password\
**9** Updating outdated DB version\
**10** Changing master password or entered master password to export DB\
**11** Setting master password\
**12** Importing DB\
**13** Unlock all cards\
**14** Selector - check selected cards


### Functions

Default boolean values are false and you're not supposed to pass them if they're not needed (true). Use null or false.


**openNav()**
Opens menu and hides message box

**closeNav(isButton)**
Closes menu
isButton:boolean Won't hide message box

**refresh(dontScroll, isAdded, refreshId)**
Refresh/Add Cards from DB to DOM
dontScroll:boolean Won't scroll to bottom of page (an animation)
isAdded:boolean Pass true if there a new card added to DB
refreshId:boolean Card element number in DB.list array (for refreshing 1 card)

**e.g.**
```javascript
refresh(true) // to completely refresh cards from DB to DOM

refresh(null, true) // adds last DB.list element to DOM

refresh(null, null, 4) // refreshes 5th card in DOM list
```

**deleteItem(item)**\
Delete a card from DB and DOM completely\
item:DOM-Element One of the buttons ('i' tag) of the card you want to delete


**refreshUndoStats()**\
Refreshes undo count in menu (DOM)

**passwordChange()**\
Add/Edit password for a DB.chosen (element number in DB) card

**lockFunc(element,id)**\
Lock/Unlock a card.\
element:DOM-Element Card's lock 'i' tag. If card is locked (has 'fa-lock' class) will require password to open and if card is unlocked (has 'fa-lock-open' class) will lock it again (actually refreshes it)\
id:int Element number that you want to unlock it

**e.g.**
```javascript
lockFunc(this) // used on onclick listener, locks/unlocks

lockFunc(null, DB["chosen"]) // unlocks DB.chosen (ID) card
```

**saveData()**\
**loadData()**\
Save data from DB variable to localstorage.\
Load data from localstorage to DB variable.

**message(content, focus, keepchosen, html, showEditCard)**\
Shows a specific message to user.\
content:string Message text\
focus:boolean Focus on input, used when you ask user for something.\
keepchosen:boolean Keep DB.chosen when focuses on input or not\
html:boolean Render content as html or text\
showEditCard:boolean Keep 'Edit card' button in message box or remove 'active' class

**changeTheme(justLoad,returnCurrentColor)**\
Changes app theme.\
Currently there are 6 themes. Each of them contains 4 color (A, B, C, D) - Bright to Dark\
A: Menu buttons - B: Cards background - C: Background - D: Menu background\
justLoad:boolean Just loads current DB colors to DOM\
returnCurrentColor:boolean Return DB color array

**e.g.**
```javascript
changeTheme() // cycles between app's themes

changeTheme(true) // loads DB theme to DOM - used on app startup

changeTheme(null, true) // returns current theme array
```

**downloadDB()**\
Exports DB - actually downloads a text file

**importData(returnPass, callback)**\
Imports DB (text file) from '#fileInput' element\
returnPass:boolean Return selected (callback should be true)\
callback:function Callback function when file loading finished (returnPass should be true)

**redScreen(keepMessage)**\
Shows and hide red screen (with transition) - used on wrong password input.\
keepMessage:boolean Doesn't work - ignore it

**jsaHash(ascii)**\
Hash function (from my JSAddition plug-in - not released). Used to save master password as hash.\
ascii:string Text you want to calculate it's hash
