import string
import json
from pprint import pprint

def checkForQuitCode(str):
    if(str == "quit" or str == "exit" or str == "leave" or str == "quit()" or str == "exit()"):
        exit()
    return str

def getName():
    name = checkForQuitCode(input("Name: "))
    if(len(name) >= 2 and not ("?" in name)):
        return name
    else:
        print("Please enter a valid name (Ex: CNN/Fox/MSNBC)")
        return getName()

def getUrl(name):
    url = checkForQuitCode(input(name + " URL: ")).lower()
    if(url.startswith("http://")):
        url = url[7:]
    if(url.startswith("https://")):
        url = url[8:]
    if(url.startswith("www.")):
        url = url[4:]
    components = url.split(".")
    if(len(components) != 2):
        print("Format should be something.com (Ex: cnn.com")
        return getUrl(name)
    if((components)[1] != "com" and (components)[1] != "org" and (components)[1] != "net"):
        print("Right now, only news sites at .com/org/net adresses are valid")
        return getUrl(name)
    return url

def getBias(name):
    bias = checkForQuitCode(input(name + " bias: ")).lower()
    if(bias == "sr" or bias == "solid right"):
        return "Solid Right"
    elif(bias == "lr" or bias == "lean right"):
        return "Lean Right"
    elif(bias == "c" or bias == "center" or bias == "m" or bias == "moderate"):
        return "Center"
    elif(bias == "ll" or bias == "lean left"):
        return "Lean Left"
    elif(bias == "sl" or bias == "solid left"):
        return "Solid Left"
    elif(bias == "l" or bias == "left"):
        print("Please specify Lean Left or Solid Left")
        return getBias(name)
    elif(bias == "r" or bias == "right"):
        print("Please specify Lean Right or Solid Right")
        return getBias(name)
    else:
        print("Choices are SL (Solid Left), LL (Lean Left), C (Center), LR (Lean Right), SR (Solid Right)")
        return getBias(name)

def getDescription(name):
    description = checkForQuitCode(input(name + " description: "))
    if(len(description) < 10):
        return "No description is available at this time"
    else:
        return description

def getReadmore(name):

    print("Press enter for https://www.allsides.com/news-source/" + name.lower().replace(" ", "-") + "-media-bias")

    url = checkForQuitCode(input("Readmore/Proof URL: ")).lower()

    if(len(url) == 0):
        return "https://www.allsides.com/news-source/" + name + "-media-bias"

    components = url.split(".")

    if(not url.startswith("www.")):
        url = "www." + url
    if(not url.startswith("http://") and not url.startswith("https://")):
        url = "https://" + url
    if(components[0] != "allsides" or components[1] != "allsides"):
        confirm = input("This does not point to an Allsides.com page (highly suggested). Are you sure? (y/N)")
        if(confirm.lower() == "y"):
            return url
        else:
            return getReadmore(name)
    return url

if __name__ == "__main__":
    while True:
        with open('ext/ratings.json') as file:
            ratings = json.load(file)
        
            name = getName()
            url = getUrl(name)
            bias = getBias(name)
            description = getDescription(name)
            readmore = getReadmore(name)

            ratings[url] = {}
            ratings[url]['name'] = name
            ratings[url]['rating'] = bias
            ratings[url]['description'] = description
            ratings[url]['readmore'] = readmore

            with open('ext/ratings.json', 'w') as outfile:  
                json.dump(ratings, outfile, ensure_ascii= True,sort_keys=True, indent=4,)
                print()
