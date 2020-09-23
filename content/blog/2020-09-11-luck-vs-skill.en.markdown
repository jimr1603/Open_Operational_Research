---
title: Luck vs Skill
author: james riley
date: "2020-09-23"
slug: luck-vs-skill
categories:
  - R
  - netlogo
tags:
  - agent-based modelling
  - Monte Carlo
  - Economics
output:
  blogdown::html_page:
    dev: "svg"
---


# Luck > Skill

A couple of weeks ago [Doctorow](https://pluralistic.net/2020/08/23/visionary-art/#more-1293) linked to a [simulation paper](https://arxiv.org/abs/1802.07068) with a discussion on 'Meritocracy'. Sure, talent is important, but have we neglected the importance of luck? 

The authors give a simulated population a Normal distribution of talent, and over a lifetime they experience lucky and unlucky events. In their model, the people at the top were rarely the most talented. It's abstract enough that you can think of it as academics struggling in a publish-or-perish situation, or the dot-coms that exploded in the 00's and quickly dwindled to ... Amazon & Google. [^1]

[^1]: Sports is another big example. I've been watching bits of Strongman in lockdown and at the top level dodging an injury can be as important as being 0.0001% better than the next guy. Even to get to TV level they have to have dodged any injury that could end a career before it starts.

At the end of that post, Doctorow:

> However, I'd like to see another version of this experiment that adds in immorality: a willingness to cheat and steal. Given the state of the plutocracy, I hypothesize an even stronger correlation.

This stuck with me. The next day I had the shower-thought "I could do that in netlogo". Not too long after that "I wonder if the researchers did it in netlogo". I grabbed the paper, and was very happy to see the netlogo screenshot on page 4!

I was even happier to see references to [archiving the model](https://www.comses.net/codebases/199a298b-fe95-473e-ad39-0fd69b5ff61c/releases/1.0.0/). (And a [GPL 2.0](http://www.gnu.org/licenses/gpl-2.0.html) licence on the code.) I keep coming across papers that are no more complicated than a linear regression, but they treat the variables of that regression a secret! 

# Adding immorality to the model

Netlogo is easier to tweak than to write from scratch, at least when you've written as little of it as I have. [My tweaked model](/code/TvLmodel_passing_the_buck.nlogo) adds "gingers" to the "individuals" who already live there. I didn't want to call them psychopaths/sociopaths, because I'd be _slightly_ wrong, so I went for being _very_ wrong by linking to the joke that gingers have no soul. For those who haven't met me, my hair and beard is red. Plus it's an excuse to colour the little stick people orange. 

I considered a couple of ways my red-heads could act unethically, but settled on *when they encounter an unlucky event, they give it to someone else*. It's fairly obvious that this gives an advantage; ordinary people can go downwards, but the unethical agents can stay where they are, or go upwards. I'm considering tweaking the model so they need to use their skill level to "pass the buck". 

I threw together a simple script with [nlrx](https://cran.r-project.org/web/packages/nlrx/index.html) that kept running this simulation overnight. The results are a giant Netlogo array, which is very like a JSON array, so I replaced the spaces with commas and let Jsonlite handle that.


```r
array_to_vec <- function(array){
  array %>% 
    str_replace_all(" ", ",") %>% 
    jsonlite::fromJSON()
}

arrays_to_vec <- function(arrays){
  map(arrays, array_to_vec) %>% 
    unlist()
}


parse_result <- function(result){
  individuals <- tibble(
    success = arrays_to_vec(result$`[success] of individuals`)
  ) %>% mutate(case="individual")
  
  gingers <- tibble(
    success = arrays_to_vec(result$`[success] of gingers`)
  ) %>% 
    mutate(case="ginger")
  bind_rows(individuals, gingers)
}


result <- read_csv(here::here("static/data/netlogo_outputs/passing_the_buck.csv"))  %>% 
  parse_result()
```

Overall, we get a similar success distribution to the original paper, so adding the immoral agents didn't break it too badly. Also, immorality is no guarantee of success - the most likely outcome for everyone is to stay roughly where they started.

I've log-scaled the 'success' axis to make it easier to see where the red-heads have ended up, rather than highlighting the log-normal distribution as in the original paper.


```r
result %>% 
  tabyl(success,case) %>%  
  adorn_percentages(denominator = "all") %>% 
  pivot_longer(-success) %>% 
  ggplot(aes(x=success,y=value,fill=name)) + geom_col() + ggthemes::theme_few() + scale_fill_manual(
    values = c("orange","light blue")
  ) + scale_x_log10() + scale_y_continuous(labels = scales::percent) + labs(
    "Overall distribution of success"
  )
```

<img src="/blog/2020-09-11-luck-vs-skill.en_files/figure-html/unnamed-chunk-2-1.svg" width="672" />

If we make each column add up to 100% then we see if the immoral agents have floated to the top. There were 1000 individuals and 50 gingers in these tests, so I'll add a horizontal line at 1000/1050:


```r
result %>% 
  tabyl(success,case) %>%  
  adorn_percentages() %>% 
  pivot_longer(-success) %>% 
  ggplot(aes(x=success,y=value,fill=name)) + geom_col() + ggthemes::theme_few() + scale_fill_manual(
    values = c("orange","light blue")
  ) + scale_x_log10() + scale_y_continuous(labels = scales::percent) + labs(
    "Overall distribution of success"
  ) + geom_hline(yintercept = 1000/1050)
```

<img src="/blog/2020-09-11-luck-vs-skill.en_files/figure-html/unnamed-chunk-3-1.svg" width="672" />

My immoral agents can't go below starting success, so they're completely unrepresented there. Since they're <5% of my simulated population they seem to have struggled to get >3 lucky events. Even if they take an unlucky event and give it to someone else, that blocks them from encountering a lucky event that tick. 

## Further thoughts

Ideas for developing this further:

- Tweak the % of gingers. How many need to be in the population before the agents burdened with morality do significantly worse from receiving more unlucky events?
- Consider making the ability to pass the unlucky event dependent on skill level.
- Make the 'passing the buck' action a net negative, not zero-sum. e.g. 2 individuals each get 75% of an unlucky event. 

## Finally

Doctorow is running a [kickstarter for pre-orders of his latest audiobook](https://www.kickstarter.com/projects/doctorow/attack-surface-audiobook-for-the-third-little-brother-book). He's sticking to principles and not going with Audible because they refuse to sell any audiobook that doesn't have DRM. 

If you've made it this far, maybe check out [Little Brother 1](https://craphound.com/littlebrother/download/), it's Freely available under more-or-less the same licence as this blog!
