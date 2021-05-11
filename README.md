Final Project - Interactive Data Visualization  
===
By: Jyalu Wu, Andrew Nolan, Matthew St Louis, Imogen Cleaver-Stigum

This is the repository for our CS 573 final project. We conducted experiment regarding weather uncertainty visualizations. You can read more about it in our Process Book!


Project Links
---

[Project Website](https://cs573-finalproject.web.app/)

[Project Video]( https://www.youtube.com/watch?v=pXo9WaOtt0o)

The Process Book PDF is in the repo!

Git Repo Structure
---
There is a lot of content in our final project submission. This is a brief overview of those files:

- ProcessBook.pdf is our ProcessBook
- CS573FinalProject.mp4 is our 2 minute video
- data-analysis: This folder includes our final survey results data and code for how we analyzed it (a python notebook and a tableau project).
- data: This include the raw json results of our survey
- dotplot: Includes some early code from trying to generate a quantile dot plot.
- react-firebase: This is where most of our code lives including the survey website and the visualizations.
    - The src folder contains: App.js, ExitSurvey.js, Instructions.js, Question.js, and Survey.js. These are all React components used to generate our survey website
    - The src folder also contains: bar-charts.js, d3-hops.js, dotplot.js, and data-generation.js. These files handle generating our weather data and the visualizations



References
---
1. M. Kay, T. Kola, J. R. Hullman, and S. A. Munson, “When (ish) is my bus? user-centered  visualizations  of  uncertainty  in  everyday,  mobile  predictive systems,”  in Proceedings  of  the  2016  chi  conference  on  human  factors  in computing systems, 2016, pp. 5092–5103.
2. A. Kale, F. Nguyen, M. Kay, and J. Hullman, “Hypothetical outcome plots help untrained observers judge trends in ambiguous data,” IEEE  transactions  on  visualization  and  computer  graphics,  vol.  25,  no.  1,  pp.  892–902, 2018.
3. M. Correll, D. Moritz, and J. Heer, “Value-suppressing uncertainty palettes,” in Proceedings of the 2018 CHI Conference on Human Factors in Computing Systems, 2018, pp. 1–11.
4. J.  Sanyal,  S.  Zhang,  J.  Dyer,  A.  Mercer,  P.  Amburn,  and  R.  Moorhead, “Noodles:   A  tool  for  visualization  of  numerical  weather  model  ensemble uncertainty,” IEEE Transactions on Visualization and Computer Graphics, vol. 16, no. 6, pp. 1421–1430, 2010.
5. L. Nadav-Greenberg, S. L. Joslyn, and M. U. Taing, “The effect of uncertainty visualizations on decision making in weather forecasting,” Journal of Cognitive Engineering and Decision Making, vol. 2, no. 1, pp. 24–47, 2008.
6. A. Kale, M. Kay, and J. Hullman, “Visual reasoning strategies and satisficing:  How uncertainty visualization design impacts effect size judgments and decisions,” arXiv preprint arXiv:2007.14516, 2020.
7. J. Hullman, X. Qiao, M. Correll, A. Kale, and M. Kay, “In pursuit of error: A  survey  of  uncertainty  visualization  evaluation,” IEEE  transactions  on visualization and computer graphics, vol. 25, no. 1, pp. 903–913, 2018.
8. J. Hullman, "Why Authors Don't Visualize Uncertainty," in IEEE Transactions on Visualization and Computer Graphics, vol. 26, no. 1, pp. 130-139, Jan. 2020, doi: 10.1109/TVCG.2019.2934287
9. Weather Shack, “Rain Measurement,” 2021, https://www.weathershack.com/static/ed-rain-measurement.html 
10. OpenWeather API, 2021, https://openweathermap.org/api 
11. J. Evans, “Creating a Production Build”, 2019, https://create-react-app.dev/docs/production-build/
12. AV Dojo, “React and Firebase | Firebase Realtime database with React |”, 2019, https://www.youtube.com/watch?v=0pC8dEqSKkc
13. J. Richards, “How to Deploy a React App with Firebase Hosting”, 2019, https://medium.com/swlh/how-to-deploy-a-react-app-with-firebase-hosting-98063c5bf425
14. Vega, “Quantile Dot Plot Example”, https://vega.github.io/vega/examples/quantile-dot-plot/
15. M. Kay, “Quantile dotplots”, 2016, https://github.com/mjskay/when-ish-is-my-bus/blob/master/quantile-dotplots.md
