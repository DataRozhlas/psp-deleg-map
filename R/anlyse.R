library(readr)

data <- read_csv("psp-delegace.csv")

data2 <- data[data$nahradnik==F,]


sort(table(data2$poslanec))

sort(table(data2$zeme))

sort(table(data2$mesto))


sum(grepl("jednání s partnerským výborem a představiteli dalších institucí", data2$zduvodneni))

208/725

length(unique(paste0(data2$usneseni,data2$kategorie,data2$cislo)))
