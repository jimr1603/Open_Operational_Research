library(here)
library(tidyverse)
library(jsonlite)

fito <- fromJSON("fitocracy-export/fitocracy_data.json")


name <- function(activity){
  activity$actions[[1]]$action$name[1]
}

names(fito) <- map_chr(fito, name)

extract_1_workout <- function(workout){
  map_dfr(workout, function(x){
    x  %>%
      select(string_metric,  actiondate, points)
  })
}

condense_1_activity <- function(activity){
  map_dfr(seq_along(activity$actions), ~extract_1_workout(activity$actions[.x])) %>%
    mutate(name=name(activity))
}

unpacked_result_table <- map_dfr(fito, condense_1_activity)

write_csv(unpacked_result_table, "JR fito.csv")
  