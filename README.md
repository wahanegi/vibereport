## Welcome to the Vibe Report App

### Badges 

[![Maintainability](https://api.codeclimate.com/v1/badges/9f965e3fb37ee200760e/maintainability)](https://codeclimate.com/github/wahanegi/vibereport/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9f965e3fb37ee200760e/test_coverage)](https://codeclimate.com/github/wahanegi/vibereport/test_coverage)

### Introduction

Vibe Report is a free weekly check-in and employee recognition tool that is easily customizable, providing an engaging, user-friendly experience that your team will be thankful for. Check-in, elicit feedback, and retain your team with actionable insights. Allow your team members to share, express themselves creatively, and recognize each other no matter where they are for a thriving, collaborative, and supportive culture.

The Vibe Report App is built on:
* Ruby 3.2.6
* Rails 7.2
* postgresql 10.0 or higher

---
## Table of Contents
[New Development Machine Install (Mac)](#new-development-machine-install-mac)

[GIT and Changing Code](#git)

[Code Submissions and Review](#code-submissions-and-reviews)

[Start Rails server](#start-rails-server)

[OpenSSL::Cipher::CipherError](#opensslcipherciphererror)

[How to Add Your Own Logo and Favicon to the Vibe Report App](#how-to-add-your-own-logo-and-favicon-to-the-vibe-report-app)

[License](#license)


---
## New Development Machine Install (Mac)

*NOTE:* After installing something new, if something doesn't work like you expect, try quitting and restarting terminal.
1. Install the latest version of XCode from the App store, run `$ xcode-select --install`
2. Install the latest version of Homebrew: http://brew.sh
3. Install Git on Mac using homebrew: `$ brew install git`
4. Set your GIT username from terminal: `$ git config --global user.name "YOUR NAME"`
5. Set your GIT email address from terminal: `$ git config --global user.email "YOUR EMAIL ADDRESS"`
6. Generate and add SSH keys your Github account by following the instructions at https://help.github.com/articles/generating-ssh-keys/
7. Install GPG using homebrew: `$ brew install gpg` (May be needed for RVM in next step)
8. Install the latest version of RVM: https://rvm.io, but instead of `gpg2` Use `gpg` in the command that adds the GPG keys.  If this doesn't work check out the [security](http://rvm.io/rvm/security) page for a workaround.
9. Install Ruby from terminal using RVM: `$ rvm install 3.2.6`
10. Install posgtresql from terminal: `$ brew install postgresql` and follow on screen instructions (very important)
11. Create postgresql superuser postgres: `$ createuser postgres -s`
12. Change your directory to where you want your work projects in terminal and clone the git repo: `$ git@github.com:wahanegi/vibereport.git`
13. Go into the directory `$ cd vibereport`. Confirm that when you run `$ rvm gemset list` it lists "vibereport" as your gemset.
14. Run `$ gem install bundler`
15. Run `$ gem update --system`
16. Run bundler: `$ bundle`
17. Install Yarn `$ brew install yarn`
18. Install Webpack dependencies `yarn install`
19. Create a new database: `$ rails db:create`
20. Install the new Heroku CLI: `$ brew tap heroku/brew && brew install heroku`.
21. Log into your Heroku account: `$ heroku login`
22. Should be ready to roll: `$ rake assets:precompile` to start the Rails server use: `$ ./bin/dev`
23. In Rubymine it's necessary to enable appropriate version of Javascript to make sure correct syntax highlighting.
    `Rubymine` -> `Preferences` -> `Languages & Frameworks` -> `Javascript`: Then set `Javascript language version` to "ECMA Script 6"



### Highly Recommended Mac Goodies
1. For pretty and customizable command line info, including branch and whether you have uncommited changes or not:

        $ brew install zsh-git-prompt

   Then update `~/.zshrc` with the following code:

        source "/usr/local/opt/zsh-git-prompt/zshrc.sh"

        PROMPT='%~%b$(git_super_status)\$ '
        
        clean_branches() {
            git remote prune origin
            git branch -vv | grep "origin/.*: gone]" | awk '{print $1}' | xargs git branch -D
        }
*NOTE*: The `source "..."` might be different than what is above. Copy/paste it from the brew installation output.

2. For a fast command line way to browse the most recent git commits: `$ brew install tig`. Then run `$ tig` at the command prompt.
3. For Code Editing: [RubyMine from JetBrains](https://www.jetbrains.com/ruby/download)

### Rubymine Support for Rubocop (Code Linting)
Code Linting gives formatting and syntax suggestions to make your code more readable.

In Rubymine go to `Rubymine` -> `Preferences` -> `Editor` -> `Inspections` -> `Ruby` -> `Gems and gems management` -> `Rubocop`: Make sure that the checkbox is checked.

## GIT

### Beginner's Guide to Changing Code

Every time you are ready to start work, do the following terminal commands in the vibereport directory:

    $ git smart-pull
    $ bundle
    $ rails db:migrate
Then if your server isn't started yet:

[Start Rails server](#start-rails-server)


At this point you can point your browser to http://localhost:3000/ and start development work.
To stop the server click `CNTL-C` in all three tabs.

To check to make sure your code changes didn't break anything critical:

    $ rspec

Green dots are good, red F's are bad. Note that sometimes other people may have broken the build, so use your best judgement if the automated test errors were caused by your code or not (for example if you undo changes and re-run the test).

To push your code changes to the repo:

        $ git add .
        $ git commit -m "CI-XXX: Message describing what changes you made"
        $ git push origin branch_name

Note: replace XXX with the Jira story ID (very important).

Switching between master and a private branch:

        $ git checkout branch_name
        $ git checkout master

### Cherry Picking
If you need to copy over a commit from one branch to another without merging:

1. Copy the SHA of the commit you want to copy over (the program "tig" is good for this which can be installed via brew on a Mac).
2. Go to the branch you want to copy the commit to ($ git checkout [BRANCHNAME])
3. Use cherry-pick to copy over the commit:

        $ git cherry-pick [SHA]

NOTE: If you have more than one commit to copy over, do the cherry-pick commands in the same order as they were commited.
Also be careful about doing this if there is a high possibility of there being a conflict.
See https://ariejan.net/2010/06/10/cherry-picking-specific-commits-from-another-branch/

## Code Submissions and Reviews

1. Any significant feature should be done in a separate branch.

         $ git checkout -b CI-XXX
2. When a feature is complete and tests pass, push to github.

         $ git push origin CI-XXX
3. If you want to update your new branch with changes from master (very recommended), do the following:

         $ git checkout master
         $ git pull origin master
         $ git checkout CI-XXX
         $ git merge master
   Then resolve conflicts manually and push to your new_branch_name again

         $ git push origin CI-XXX

4. When all work in branch is done, create a pull request:
    - Go to https://github.com/wahanegi/vibereport
    - Click "Pull Requests" -> "New Pull Request"
    - Set base branch to master and compare-to branch to the `CI-XXX` branch where you've done your work
    - Click "Create pull request"
    - Add a description of the pull request and start the pull request description with the story or epic ID, `CI-XXX`

## Start Rails server

To start a Rails server with React, you need to  use the command every time you start the server:

`rake assets:precompile` 

To start the Rails server use: `./bin/dev`

otherwise you won't be able to see your updated CSS and JavaScript 

NOTE: `rails s` - is not used

## Populate the Database with Necessary Data

Follow these steps to set up the database with the required data for the application:

### Step 1: Start the Rails Console
Run the Rails console using the following command:

```bash
rails c
```

### Step 2: Create an Admin User
Use the command below to create an admin user:

```ruby
AdminUser.create!(email: 'youremail@gmail.com', password: '1234qwer')
```

---

### Step 3: Log in as the Admin User
1. Open your browser and navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login).
2. Enter the email and password you used to create the admin user.

---

### Step 4: Populate Data via the Admin Dashboard
Once logged in, complete the following steps in the Admin Dashboard:

#### 4.1: Create a User
- Navigate to the **Users** tab.
- Fill out all required fields to create a user.

#### 4.2: Add Emotions
- Navigate to the **Emotions** tab.
- Create approximately 10 emotions (both positive and negative).

#### 4.3: Create a Team
- Navigate to the **Teams** tab.
- Add a new team.

#### 4.4: Set Up a Time Period
- Navigate to the **Time Periods** tab.
- Create a new time period with the following details:
   - **Start Date**: Set to today.
   - **End Date**: Set to a future date.
   - **Due Date**: Set to a future date.

---

### Step 5: Log in as the User
1. Open your browser and go to [http://localhost:3000/users/sign_in](http://localhost:3000/users/sign_in).
2. Enter the name and password you provided when creating the user.
3. After signing in, you should see the message: **Check your inbox!**

---

### Step 6: Access the Application via Email
1. The [Letter Opener](https://github.com/ryanb/letter_opener) gem will open a new tab displaying the email.
2. Click on the **Access Site** link in the email to log into the application.


## OpenSSL::Cipher::CipherError

When you create encrypted credentials in Rails 7, the contents of the `config/credentials.yml.enc` file are encrypted using a master key that is stored in the `config/master.key` file. This encryption process uses the `OpenSSL library`, and if there is a problem with `OpenSSL`, you might see the `OpenSSL::Cipher::CipherError` error.

### Solution

To address the `OpenSSL::Cipher::CipherError` error in Rails application, you can follow these steps:

- Remove `config/credentials.yml` or `config/credentials.yml.enc` if present from the project directory.

- Open a terminal and navigate to the project directory.

- Run the following command to open the Rails credentials file for editing:

    `EDITOR="code --wait" bin/rails credentials:edit` - just replace “code” with whatever editor you use.

- Save the file and exit the editor.

Test the application to make sure the error no longer occurs.

## How to Add Your Own Logo and Favicon to the Vibe Report App

### Locate the Assets Folder

In your application's source code, navigate to the assets folder. This folder should contain all the visual assets used by your app, including the current logo and favicon files.

### Replace the Logo

Save your company logo as logo.svg, and then copy over the current image in app/assets/images/logo.svg. The maximum height to width ratio of your logo should be set to 1:4.

### Replace the Favicon

Copy your company's favicon (in SVG format) to app/assets/images/favicon.svg. It should be a square image (1:1 ratio).

### Save Changes

Once you've replaced the logo and favicon files, save your changes to the assets folder.

## License

The MIT License (MIT)

Copyright (c) 2023 Clearbox Decisions Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.