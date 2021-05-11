import React, { Component } from 'react';
import './App.css';
import team_members from './team-members.jpg'

class Summary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setPage: props.setPage
        }
    }

    render() {
        return (
            <div>
                <h1>Summary</h1>
                <p>The following is an executive summary of our experiment. To see the experiment itself and the visualizations we created, click the following button.</p>
                <button className="button"
                    onClick={() => this.state.setPage('Welcome')}>
                    Continue to Experiment
                </button>

                <h2>Concise Resources</h2>
                <p>The following video summarizes our experiment and key findings in two minutes.</p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/pXo9WaOtt0o" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                <p>Here are some other resources to accompany our project</p>
                <li><a target="_blank" href="https://github.com/jwu2018/datavis-final/blob/main/ProcessBook.pdf">Process Book</a></li>
                <li><a target="_blank" href="https://github.com/jwu2018/datavis-final">GitHub Project</a></li>
                <li><a target="_blank" href="https://public.tableau.com/profile/j.wu7306#!/vizhome/HelpingUsersMakeDecisionsbyVisualizingWeatherUncertainty/HelpingUsersMakeDecisionsbyVisualizingWeatherUncertainty">
                        Tableau Results
                </a></li>

                <h2>Overview</h2>
                <p>
                    We are a team of four students –
                    <a target="_blank" href="https://acnolan.tech"> Andrew Nolan</a>,
                    <a target="_blank" href="https://github.com/imogencs"> Imogen Cleaver-Stigum</a>,
                    <a target="_blank" href="https://github.com/jwu2018/"> Jyalu Wu</a>, and
                    <a target="_blank" href="https://mastlouis.github.io"> Matthew St Louis</a> – and this is our final
                    project for Worcester Polytechnic Institute's graduate data visualization course.
                </p>
                <p>This project aims to determine the best way to visualize uncertainty in weather predictions. Our group has spent a lot of time looking into uncertainty visualizations, and we feel the final project may be one place we can apply them in an interesting way. Specifically, we are inspired by quantile dot plots and hypothetical outcome plots.</p>
                <p>We see precipitation uncertainty as a concise metric for binary decision-making. We presented participants with several visualizations that display the uncertainty around precipitation and ask them how they would handle certain situations (e.g. paying a small fee to move a community event to an indoor space, going for a walk outside, rescheduling a hike with friends). We also asked participants to estimate the expected level of precipitation at a certain time based on the visualizations. Our goal was to find out how the visualization type affects the participant’s answers, what visualization types make the user feel most confident in their decisions, and what visualization types are most accurately readable to participants.</p>

                <p>We designed this website as an experiment to gather data on how useful our visualizations were to users and how comfortable users felt with our visualizations. We used four visualization types and five question types, and each participant receives every possible combination between them: </p>
                <p><strong>Question Types</strong></p>
                <ul>
                    <li>Decision-Based</li>
                    <ul>
                        <li>Changing plans for a personal activity</li>
                        <li>Changing plans for a group activity</li>
                        <li>Booking an indoor space for a community activity</li>
                    </ul>
                    <li>Quantitative</li>
                    <ul>
                        <li>Quantifying chance of precipitation</li>
                        <li>Quantifying amount of precipitation</li>
                    </ul>
                </ul>

                <p><strong>Visualization Types</strong></p>
                <dl>
                    <dt>Text: </dt> <dd>
                        A description of the amount and uncertainty of rain throughout the day in English prose.
                    </dd>
                    <dt>Bar Plot: </dt> <dd>
                        A series of bars where bar's position represents time of day and hight represents amount of precipitation. Uncertainty is not encoded.
                    </dd>
                    <dt>Hypothetical Outcome Plot: </dt> <dd>
                        A bar plot that animates to show different hypothetical outcomes that are possible from the given probability distribution of rain. In layman's terms, this shows different ways the day could go, and the more likely outcomes appear more frequently.
                    </dd>
                    <dt>Quantile Dot Plot: </dt> <dd>
                        A series of dots that form a probability distribution of the amount and uncertainty of rain. This visualization animates to show different hours of the day.
                    </dd>
                </dl>

                <p>For a full description of our project, check out our <a target="_blank">Process Book</a> and <a target="_blank" href="https://github.com/jwu2018/datavis-final">Repository</a>!</p>

                <h2>Results and Findings</h2>
                <p>The following summarizes our findings from the experiment from the days it was running.</p>

                <p>To further explore the results more granularly, check out our <a target="_blank" href="https://public.tableau.com/profile/j.wu7306#!/vizhome/HelpingUsersMakeDecisionsbyVisualizingWeatherUncertainty/HelpingUsersMakeDecisionsbyVisualizingWeatherUncertainty">Tableau Page</a>!</p>
                <div class='tableauPlaceholder' id='viz1620699610439' style={{position: 'relative'}}>
                    <noscript>
                        <a href='#'>
                            <img alt='Helping Users Make Decisions by Visualizing Weather Uncertainty ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;He&#47;HelpingUsersMakeDecisionsbyVisualizingWeatherUncertainty&#47;HelpingUsersMakeDecisionsbyVisualizingWeatherUncertainty&#47;1_rss.png' style={{border: 'none'}} />
                        </a>
                    </noscript>
                    <object class='tableauViz' style={{display:'none'}}>
                        <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> 
                        <param name='embed_code_version' value='3' /> 
                        <param name='site_root' value='' />
                        <param name='name' value='HelpingUsersMakeDecisionsbyVisualizingWeatherUncertainty&#47;HelpingUsersMakeDecisionsbyVisualizingWeatherUncertainty' />
                        <param name='tabs' value='no' />
                        <param name='toolbar' value='yes' />
                        <param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;He&#47;HelpingUsersMakeDecisionsbyVisualizingWeatherUncertainty&#47;HelpingUsersMakeDecisionsbyVisualizingWeatherUncertainty&#47;1.png' /> 
                        <param name='animate_transition' value='yes' />
                        <param name='display_static_image' value='yes' />
                        <param name='display_spinner' value='yes' />
                        <param name='display_overlay' value='yes' />
                        <param name='display_count' value='yes' />
                        <param name='language' value='en' />
                    </object>
                </div>                
                <script type='text/javascript'>                    
                    var divElement = document.getElementById('viz1620699610439');                    
                    var vizElement = divElement.getElementsByTagName('object')[0];                    
                    vizElement.style.width='1000px';vizElement.style.height='827px';                    
                    var scriptElement = document.createElement('script');                    
                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    
                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                
                </script>
            </div>
        )
    }
}

export { Summary }