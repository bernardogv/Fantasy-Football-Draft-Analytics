import json
import os


def clean_json_data(json_data):
    cleaned_data = []

    for player in json_data['Data']:
        cleaned_player = []
        cleaned_player.append(player.get('Rank', 'N/A'))
        cleaned_player.append(player.get('Name', 'N/A'))
        cleaned_player.append(player.get('Team', 'N/A'))
        cleaned_player.append(player.get('FantasyPosition', 'N/A'))
        cleaned_player.append(player.get('Played', 'N/A'))

        cleaned_player.append(player.get('FantasyPointsPerGame', 'N/A'))
        cleaned_player.append(player.get('FantasyPoints', 'N/A'))

        cleaned_player.append(player.get('PassingYards', 'N/A'))
        cleaned_player.append(player.get('RushingYards', 'N/A'))  # Added this line
        cleaned_player.append(player.get('ReceivingYards', 'N/A'))  # Added this line

        cleaned_player.append(player.get('PassingTouchdowns', 'N/A'))
        cleaned_player.append(player.get('PassingInterceptions', 'N/A'))

        cleaned_player.append(player.get('Sacks', 'N/A'))
        cleaned_player.append(player.get('FumblesForced', 'N/A'))
        cleaned_player.append(player.get('FumblesRecovered', 'N/A'))

        cleaned_data.append(cleaned_player)

    return cleaned_data


# List of JSON files
json_files = [
    '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json.json',
    '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json2.json',
    '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json3.json',
    '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json4.json',
    '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json5.json',
    '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json6.json'
    # The one underneath is for the team one
    # '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json_team.json'
]

final_cleaned_data = []

# Loop through each file to read and clean the data
for json_file in json_files:
    if os.path.exists(json_file):
        with open(json_file, 'r') as f:
            json_data = json.load(f)
            cleaned_data = clean_json_data(json_data)
            final_cleaned_data.extend(cleaned_data)
    else:
        print(f"File {json_file} does not exist.")

# Write the cleaned data to a new JS file
output_file = '/Fantasy-Football-Draft-Analytics/JsonCleanUp/cleaned_fantasy_data.js'
with open(output_file, 'w') as f:
    f.write("const stat_data = ")
    f.write(json.dumps(final_cleaned_data, indent=4))
    f.write(";")

print(f"Cleaned data has been written to {output_file}")
