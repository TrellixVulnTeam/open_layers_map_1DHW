# OKMG CLIENT SIMPLE MAP

  - This repo has been created to serve client websites that are limited to a requirement of **x1** map location.
  
## INSTRUCTIONS: Configure / Deploy

### Configuration
1. Clone repo and create new branch for client map via: ```git -b checkout <new-client-branch>```
2. ```npm install``` install node dependencies
3. ```npm run start``` starts the app
4. Navigate to and open: Scss > Style.scss update the variables at the top of the ```.scss``` file in line with client branding
5. Navigate to and open: Map.js edit the following (search for the following comments): 
- ```// Destination ``` : Longitude / Latitude of destination
- ```// pop up information``` : Heading / By Line /  Google Outbound Link / Shordhand Address

### Deployment

#### Note: 
  - Currently dependant on Bootstrap and jQuery
  - Once deployed defer scripts and remove jQuery
  - You may need to remove Bootstrap.css if there are conflicts with your existing class names; additional configuration may apply.
  - Future updates are in progress which will hopefully solve these issues.
  
1. ```npm run build ```
2. ```zip -r dist.zip dist```
3. ```scp dist.zip <client:destination> (SSH copy)```
4. ```unzip dist.zip``` > ```mv dist map```
5. ```cd map``` > ```mv index.html index.php``` > **open index.php** > **remove jquery** > **add full relative url to** ```.css``` **and** ```.js``` **referenced compiled files** (e.g.```/wp-content/themes/obrother/templates/map/map.df5cd33e.js```
5. Include the map at into the desired template via(example): ```<?php include(get_template_directory() . "/templates/map/index.php"); ?>```
6. Done!
