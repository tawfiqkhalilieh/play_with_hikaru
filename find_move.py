import chess

def find_move(fen, player = 'hikaru'):
    if 'w' in fen.split(' '):
        # open the file player.moves and read the lines
        with open(f"top_players/{player}_white.moves", "r") as f:
            lines = f.readlines()
    else:
        # open the file player.moves and read the lines
        with open(f"top_players/{player}_black.moves", "r") as f:
            lines = f.readlines()
    
    # loop through the lines and split them by spaces
    for line in lines:
        # create a board object from the fen
        board = chess.Board()
        moves = [ mv for mv in line.split() if '.' not in mv ][:-1]

        # loop through the moves and make them on the board
        for move in moves:
            if fen == board.fen():
                return move
            else:
                try:
                    board.push_san(move)
                except:
                    break

# print("I found the move: " + 
#     str(
#         find_move(fen='rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1')
#     )
# )