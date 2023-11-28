import requests

# Define the URL
url = 'https://fantasydata.com/nfl/fantasy-football-leaders?season=2023&seasontype=1&scope=1&subscope=1&aggregatescope=1&range=3'

# Fetch the webpage using the requests library
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Save the HTML content
    html_content = response.text

    # Optionally, save the HTML content to a file
    with open('../RawHtml/webpage.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

    print('HTML content fetched and saved.')
else:
    print(f'Failed to fetch the webpage. Status code: {response.status_code}')

# The variable html_content now contains the HTML source code of the webpage
