Add XP and Michi-Coins
To do this:
1. Create a new service in C:\uatf\fer\felinode\feliNode\src\features\gamification\services to save the state locally and synchronize it with SupaBase (using MCP, create the table in SupaBase).

2. Create a new badge in C:\uatf\fer\felinode\feliNode\src\features\gamification\components (this will display the XP and coin information and icons retrieved from the service). Clicking it will take you to a shop screen.

3. Change the setting so that completing a lesson awards XP and Michi-Coins as a reward (approximately 30 coins and 100 XP).

4. Create a shop screen to display the products that can be purchased with Michi-Coins (currently, only streak protectors can be purchased (maximum 2, at 70 coins each), and it shows how much XP you have)