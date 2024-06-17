api="7ef48c3c-3c65-41f6-bcd8-ec9410b03f35"
threshold = 250000

guilds=["Dominance","Rebel","Sailor Moon","The Dawns Awakening","Lucid","The Abyss","Leman","Puffy","Electus"]

names=["Preferability","Bikkie","Ownerd","ErtrycheZ","Dragons","Nemqnja","Skorlex","ShiningTurtle","Evdia","avaaidan","ichhabevape","alpap123","taahw","MewtwoY","_eese","domisseus","Executed","King__Baby","JinxRaider23","Melkmeisje","Muuufy","MacchuPicchu","MetroMirror","60c","Pocketing","typefast","TournamentTokens","Wholsom","Yann31_","eliadbg","cchloe","byToxical","Laggier","Nyamih"]





import requests
from mcuuid import MCUUID


#lb = requests.get(f"https://api.hypixel.net/leaderboards?key={api}").json()

guild = requests.get(f"https://api.hypixel.net/guild?name=The Blood Lust&key={api}").json()
for i in range(len(guild['guild']['members'])):
    player = MCUUID(uuid=guild['guild']['members'][i]['uuid'])        
    if sum(guild['guild']['members'][i]['expHistory'].values())>100000 and player.name not in names:
        names.append(player.name)


boosters = requests.get(f"https://api.hypixel.net/boosters?key={api}").json()
for i in range(len(boosters['boosters'])):
        player = MCUUID(uuid=boosters['boosters'][i]['purchaserUuid'])
        if player.name not in names:
            names.append(player.name)


for guildname in guilds:
    guild = requests.get(f"https://api.hypixel.net/guild?name={guildname}&key={api}").json()
    for i in range(len(guild['guild']['members'])):
        player = MCUUID(uuid=guild['guild']['members'][i]['uuid'])        
        if sum(guild['guild']['members'][i]['expHistory'].values())>threshold and player.name not in names:
            names.append(player.name)

            

with open ("names.json","w") as f:
    f.write('["')
    f.write('","'.join(names))
    f.write('"]')


print("New names have been generated")
