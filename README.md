Final Project - Interactive Data Visualization  
===

Project Website: https://cs573-finalproject.web.app/
Project Video: https://www.youtube.com/watch?v=pXo9WaOtt0o

The key learning experience of this course is the final project. 
You will design a web site and interactive visualizations that answer questions you have or provide an exploratory interface to some topic of your own choosing. 
You will acquire the data, design your visualizations, implement them, and critically evaluate the results. 

The path to a good visualization is going to involve mistakes and wrong turns. 
It is therefore important to recognize that mistakes are valuable in finding the path to a solution, to broadly explore the design space, and to iterate designs to improve possible solutions. 
To help you explore the design space, we will hold events such as feedback sessions in which you propose your idea and initial designs and receive feedback from the class and staff.

Proposing Ideas (due Apr 05 Monday)
---

Submit project proposals using [this Google Form](https://docs.google.com/forms/d/e/1FAIpQLSePvr2yyOwT-iwl-mVsYL5lNSJIwEx7Lius6Q8_5Tm2WxX6nA/viewform?usp=sf_link).
You may submit more than one proposal.
1-3 folks per team.

Prospectus (due Apr 16 Friday)
---

After choosing your topic and forming your team. Create a brief PDF writeup with more detail using the prospectus repo (a separate repository). After submitting, we will go over your PDFs in team + professor meetings on Zoom to discuss feedback on scope, ideas, etc.

Final Project Materials (due May 10 Monday)
---
For your final project you must hand in the following items.

### Process Book

An important part of your project is your process book. Your process book details your steps in developing your solution, including the alternative designs you tried, and the insights you got. Develop your process book out of the project proposal. Equally important to your final results is how you got there! Your process book is the place you describe and document the space of possibilities you explored at each step of your project. It is not, however, a journal or lab notebook that describes every detail - you should think carefully about the important decisions you made and insights you gained and present your reasoning in a concise way.

We strongly advise you to include many figures in your process book, including photos of your sketches of potential designs, screen shots from different visualization tools you explored, inspirations of visualizations you found online, etc. Several images illustrating changes in your design or focus over time will be far more informative than text describing those changes. Instead, use text to describe the rationale behind the evolution of your project.

Your process book should include the following topics. Depending on your project type the amount of discussion you devote to each of them will vary:

- Overview and Motivation: Provide an overview of the project goals and the motivation for it. Consider that this will be read by people who did not see your project proposal.
- Related Work: Anything that inspired you, such as a paper, a web site, visualizations we discussed in class, etc.
- Questions: What questions are you trying to answer? How did these questions evolve over the course of the project? What new questions did you consider in the course of your analysis?
- Data: Source, scraping method, cleanup, etc.
- Exploratory Data Analysis: What visualizations did you use to initially look at your data? What insights did you gain? How did these insights inform your design?
- Design Evolution: What are the different visualizations you considered? Justify the design decisions you made using the perceptual and design principles you learned in the course. Did you deviate from your proposal?
- Implementation: Describe the intent and functionality of the interactive visualizations you implemented. Provide clear and well-referenced images showing the key design and interaction elements.
- Evaluation: What did you learn about the data by using your visualizations? How did you answer your questions? How well does your visualization work, and how could you further improve it?

As this will be your only chance to describe your project in detail make sure that your process book is a standalone document that fully describes your results and the final design. 
[Here](http://dataviscourse.net/2015/assets/process_books/bansal_cao_hou.pdf) are a [few examples](http://dataviscourse.net/2015/assets/process_books/walsh_trevino_bett.pdf) of process books from a similar course final.

### Project Website

You will create a public website for your project using GitHub pages or any other web hosting service of your choice. 
The web site should contain your interactive visualization, summarize the main results of the project, and tell a story. 
Consider your audience (the site should be public public) and keep the level of discussion at the appropriate level. 
Your process book and data should be linked from the web site as well. 
Also embed your interactive visualization and your screen-cast in your website. 
If you are not able to publish your work (e.g., due to confidential data) please let us know in your project proposal.

### Project Screen-Cast

Each team will create a two minute screen-cast with narration showing a demo of your visualization and/or some slides. 
You can use any screencast tool of your choice, such as Camtasia. 
Please make sure that the sound quality of your video is good - it may be worthwhile to invest in an external USB microphone. 
Upload the video to an online video-platform such as YouTube or Vimeo and embed it into your project web page. 
We will show some of the best videos in class.

We will strictly enforce the two minute time limit for the video, so please make sure you are not running longer. 
Use principles of good storytelling and presentations to get your key points across. Focus the majority of your screencast on your main contributions rather than on technical details. 
What do you feel is the best part of your project? 
What insights did you gain? 
What is the single most important thing you would like your audience to take away? Make sure it is front and center rather than at the end.

Outside Libraries/References
---

For this project you *do not* have to write everything from scratch.

You may *reference* demo programs from books or the web, and *include* popular web libraries like Bootstrap, JQuery, Backbone, React, Meteor, etcetera. 

Please *do not* use libraries on top of d3, however. Libraries like nvd3.js look tempting, but such libraries often have poor defaults and result in poor visualizations.
Instead, draw from the numerous existing d3 examples on the web, factoring the building of visualizations into your timeline.

If you use outside sources please provide a References section with links at the end of your Readme.

Resources / Ideas
---

The "[Data is Plural](https://tinyletter.com/data-is-plural/archive)" weekly letter often contains interesting datasets.

OurWorldInData has good datasets, as well.

In general, implementing techniques from research papers, or conducting new experiments, is a solid way to get a project that is both within scope, interesting, and beneficial to you in the long run.

Requirements
---

Store the following in your github repository:

- Code - All web site files and libraries assuming they are not too big to include
- Data - Include all the data that you used in your project. If the data is too large for github store it on a cloud storage provider, such as Dropbox or Yousendit.
- Process Book- Your Process Book in PDF format.
- README - The README file must give an overview of what you are handing in: which parts are your code, which parts are libraries, and so on. The README must contain URLs to your project websites and screencast videos. The README must also explain any non-obvious features of your interface.

GitHub Details
---

- Fork the repo. You now have a copy associated with your username.
- Make changes to index.html to fulfill the project requirements. 
- Make sure your "master" branch matches your "gh-pages" branch. See the GitHub Guides referenced above if you need help.
- Edit the README.md with a link to your gh-pages or other external site: for example http://YourUsernameGoesHere.github.io/DataVisFinal/index.html
- To submit, make a [Pull Request](https://help.github.com/articles/using-pull-requests/) on the original repository.

Grading
---

- Prospectus - Did the prospectus contain sufficient thought, detail, and related work to facilitate a clear project plan?
- Process Book - Are you following a design process that is well documented in your process book?
- Solution - Is your visualization effective in answering your intended questions? Was it designed following visualization principles?
- Implementation - What is the quality of your implementation? Is it appropriately polished, robust, and reliable?
- Presentation - Are your web site and screencast clear, engaging, and effective?
Your individual project score will also be influenced by your peer evaluations.

References
---

- Material adapted from http://dataviscourse.net/2015/project/
