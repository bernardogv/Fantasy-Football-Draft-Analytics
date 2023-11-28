import json
import os


def read_and_format_json(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)

    formatted_data = []

    if isinstance(data, dict):
        for key in data.keys():
            if isinstance(data[key], list):
                for player in data[key]:
                    name = player.get('Name', 'Unknown')
                    fpts = player.get('FantasyPoints', 0)
                    formatted_data.append([name, fpts])
                break

    return formatted_data


if __name__ == "__main__":
    # Define the JSON file paths
    json_files = [
        # '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json.json',
        # '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json2.json',
        # '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json3.json',
        # '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json4.json',
        # '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json5.json',
        # '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json6.json'
        # The one underneath is for the team one
        '/Users/Starfam99/SportsBetting/Fantasy-Football-Draft-Analytics/FantasyJsonData/Fantasy_web_json_team.json'
    ]

    # Initialize an empty list to hold all the formatted data
    all_formatted_data = []

    # Loop through each JSON file and call read_and_format_json function
    for json_file in json_files:
        if os.path.exists(json_file):
            formatted_data = read_and_format_json(json_file)
            all_formatted_data.extend(formatted_data)
        else:
            print(f"File {json_file} does not exist.")

    # Prepare the string representation of the all_formatted_data for the script
    all_formatted_data_str = json.dumps(all_formatted_data, indent=2)

    # Create the complete script string
    script_str = f"var fptsData = {all_formatted_data_str};"

    # Save to a JavaScript file
    with open('fptsData_script.js', 'w') as f:
        f.write(script_str)

    # Or print it out to copy manually
    print(script_str)
