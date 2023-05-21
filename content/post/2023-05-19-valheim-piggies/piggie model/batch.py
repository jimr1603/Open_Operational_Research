import mesa
from piggie_model import PigPenModel
import pandas as pd

params = {"width": range(1, 60, 1), "N": 4}

results = mesa.batch_run(
    PigPenModel,
    parameters=params,
    iterations=5,
    max_steps=1000,
    number_processes=1,
    data_collection_period=1,
    display_progress=True,
)

results_df = pd.DataFrame(results)
results_df.to_csv("2023-05-16.csv",index=False )