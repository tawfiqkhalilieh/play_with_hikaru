from fastapi import FastAPI, Header, Query
import chess
import chess.engine
from find_move import find_move
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated

# Create a FastAPI app object
app = FastAPI()

engine: chess.engine.SimpleEngine = chess.engine.SimpleEngine.popen_uci(r"fish.exe")
engine.configure(
        {
            "UCI_LimitStrength": True, 
            "UCI_Elo": 2800
        }
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return 'Play With Top Players V 0'

# Define a GET route that takes a fen as a query parameter
@app.post("/play")
def play(
    strange_header: str | None = Header(default=None, convert_underscores=False)
):
    fen = strange_header
    print(fen)
    move: str = find_move(fen)
    return {
        "move": move,
        "source":"data"
    } if move else {
        "move": str(engine.play(chess.Board(fen=fen), chess.engine.Limit(time=0.1)).move),
        "source": "engine"
    }

