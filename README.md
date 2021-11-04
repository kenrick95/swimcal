# Swimcal

## What

A calendar showing summary of swims from Fitbit exercise data

## Why

Because Fitbit dashboard doesn't have this functionality

## How

1. Run a ["Export Your Account Archive"](https://www.fitbit.com/export/user/data) at Fitbit.
2. Check your email to confirm the Fitbit data export request. The archive may take a few hours or even days to be completed.
3. Clone repo
4. Extract the Fitbit export, locate the `exercise-${number}.json` files under "Physical Activity" folder. Copy them to the repo's `data` folder
5. At the repo, run `yarn` and then `yarn dev`
6. Open browser at `http://localhost:3000`
