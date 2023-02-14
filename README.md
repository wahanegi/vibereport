## Welcome to the Vibe Report App

### Introduction

The Vibe Report App is built on:
* Ruby 3.1.2
* Rails 7.0.4
* postgresql 10.0 or higher


---
## Table of Contents
[New Development Machine Install (Mac)](#new-development-machine-install-mac)

[GIT and Changing Code](#git)

[Code Submissions and Review](#code-submissions-and-reviews)



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
9. Install Ruby from terminal using RVM: `$ rvm install 3.1.2`
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
22. Should be ready to roll: `$ rails s`
23. Open a new tab in terminal and start redis: `$ redis-server`
24. In Rubymine it's necessary to enable appropriate version of Javascript to make sure correct syntax highlighting.
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

1. Tab 1: `$ rails s`


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

