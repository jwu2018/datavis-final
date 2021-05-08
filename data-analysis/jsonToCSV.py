import json
import math
import csv

# Turn the json file into a dictionary
jsonFile = open('data/surveyresults_5-7-21.json')
d = json.load(jsonFile)

# Loop through the dictionary and make a csv
headerRow = [
    'id', 
    'preferred app'
    'app use frequency',
    'experience on app',
    'app inaccuracy',
    'app reliable',
    'stats experience',
    'trial vis type', #TODO fix order of trial headers
    'trial guess', 
    'trial true value', 
    'leeway',
    'effort bar',
    'effort dot',
    'effort hop',
    'effort text',
    'rank1',
    'rank2',
    'rank3',
    'rank4',
    'feedback',
]
# headerRow = ['id','Education','Field','Statistics Experience','Data vis experience','trial vis type','trial reported percent','trial true percent','trial log error']

d = d['data']
with open('data-analysis/output.csv', 'w', newline='') as csvfile:
    csvWriter = csv.writer(csvfile, delimiter=',')
    csvWriter.writerow(headerRow)
    i =1
    for key in d:
        print('person', i, 'key', key)
        i = i+1
        row = []
        # get id
        row.append(key)

        # get demographic info
        demographic = d[key]['demographic']
        # print(demographic['app'])
        row.append(demographic['frequency'])
        row.append(demographic['experience'])
        row.append(demographic['inaccurate'])
        if ('reliable' in demographic.keys()):
            row.append(demographic['reliable'])
        else:
            row.append(demographic['Reliable'])
        row.append(demographic['stats'])

        # get exit survey results
        exitSurveyResults = d[key]['exitSurveyResults']
        row.append(exitSurveyResults['EffortBar'])
        row.append(exitSurveyResults['EffortDot'])
        row.append(exitSurveyResults['EffortHOP'])
        row.append(exitSurveyResults['EffortText'])
        row.append(exitSurveyResults['Rank1'])
        row.append(exitSurveyResults['Rank2'])
        row.append(exitSurveyResults['Rank3'])
        row.append(exitSurveyResults['Rank4'])
        row.append(exitSurveyResults['Feedback'])

        # get trial data
        for trial in d[key]['trials']:
            if ('done' not in trial.keys()):
                print(type(trial))
                subRow = []
                # id
                subRow.append(row[0])

                # demographics
                subRow.append(row[1])
                subRow.append(row[2])
                subRow.append(row[3])
                subRow.append(row[4])
                subRow.append(row[5])

                # trial information
                # TODO finish this section
                subRow.append(trial['type'])
                subRow.append(trial['questionType'])
                # print(trial['mainAnswer'])
                subRow.append(trial['mainAnswer'])
                # TODO add leeway
                # TODO add correct answer
                subRow.append(trial['confidence'])
                subRow.append(trial['followUpText'])
                # truePercent = trial['low']/trial['high']
                # subRow.append(truePercent)
                # logError = math.log((abs((truePercent*100)-(float(trial['guess'])*100))+0.125),2)
                # subRow.append(logError)
                print(subRow)

                
                # "askedForHelp" : false,
                # "confidence" : "Very unsure",
                # "followUpText" : "",
                # "mainAnswer" : "0.3",
                # "points" : [ [ 0.45, 0.25, 0.3, 0.35, 0.3, 0.05, 0.1, 0.1, 0.1, 0.1, 0.1, 0, 0, 0.05, 0.2, 0.3, 0.2, 0.1, 0.45, 0.3, 0.1, 0.3, 0.35, 0.5 ], [ 0.7, 0.65, 0.7, 0.55, 0.55, 0.35, 0.3, 0.5, 0.3, 0.2, 0.15, 0.05, 0, 0.1, 0.3, 0.4, 0.45, 0.55, 0.75, 0.8, 0.7, 0.8, 0.9, 0.95 ] ],
                # "questionType" : "amount",
                # "type" : "Hypothetical Outcome Plot"
                
                # exit survey
                subRow.append(row[6])
                subRow.append(row[7])
                subRow.append(row[8])
                subRow.append(row[9])
                subRow.append(row[10])
                subRow.append(row[11])
                subRow.append(row[12])
                subRow.append(row[13])
                subRow.append(row[14])
                # print(subRow)
                csvWriter.writerow(subRow)


'''
Return the true prediction and true chance of precipitation for a
specific trial question. The true values can either be a point
value or a weighted average, based on the type of question.
'''
def true_values(all_predictions, all_chances, question_type):
    if (question_type == 'friend' || question_type == 'alone' || question_type == 'event'):
        data_avg(all_predictions, all_chances, question_type)

    elif (question_type == 'amount' || question_type == 'probability'):
        return [all_predictions[15], all_chances[15]]

    else: print('Error: Not a trial')
        

'''
Calculate the weighted average prediction and weighted average chance
of precipitation based on the type of viz
'''
def data_avg(all__predictions, all_chances, question_type):
    before_sum = 0
    after_sum = 0
    during_value = 0

    # check weather 2 hrs before to see if ground is wet
    # and 4 hrs after bc hiking will probs take that long
    if question_type == 'friend':
        before_sum = 

    elif question_type == 'alone':

    elif question_type == 'event':