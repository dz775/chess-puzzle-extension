window.onload = function() {
(() => {
    function checkPiece(x,y,pcs,conf){
        for (let c = 0; c < conf.length; c++){
            if(conf[c] === (x.toString()+y.toString())){
                return pcs[c]
            }
        }
        return 0
    }
    function createFen(pcs, conf){
        fen = "";
        for (y = 8; y >= 1; y--) {
            for (x = 1; x <= 8; x++) {
                var cp = checkPiece(x,y,pcs,conf)
                if (cp != 0){
                    fen += cp
                }
                else{
                    if(isNaN(Number(fen.charAt(fen.length-1))) == false){
                        fen = fen.slice(0, -1)+(Number(fen.charAt(fen.length-1))+1).toString();
                    }
                    else{fen += '1'}
                }
            }
            fen += '/'
        }
        fen = fen.slice(0, -1)
        return fen
    }
    
    function solvePuzzle(){
        var all_piece = document.getElementsByClassName('piece');
        let pcs = []
        let conf = []
        const sf = {'wp':'P','wr':'R','wn':'N','wb':'B','wq':'Q','wk':'K','bp':'p','br':'r','bn':'n','bb':'b','bq':'q','bk':'k'}
        for (let i = 0; i < all_piece.length; i++) {
            if (all_piece[i].classList[1].length == 2){
                pcs.push(all_piece[i].classList[1]);
                conf.push(all_piece[i].classList[2].split('-')[1]);
            }
            else{
                pcs.push(all_piece[i].classList[2]);
                conf.push(all_piece[i].classList[1].split('-')[1]);
            }
        }
        for (let idi=0; idi < pcs.length; idi++){
            pcs[idi] = sf[pcs[idi]]
        }
        var fen = createFen(pcs, conf)
        try{
            if (document.getElementsByClassName('section-heading-title')[0].innerHTML == 'Black to Move'){
                fen += '%20b%20-%20-%200%201'
            }
            else{fen += '%20w%20-%20-%200%201'}
        }
        catch(err){
            console.log(err)
            if (document.getElementsByClassName('section-heading-title')[0].innerHTML == 'Black to Move'){fen += '%20b%20-%20-%200%201'}
            else {fen += '%20w%20-%20-%200%201'}
        }
        // fen += '%20w%20-%20-%200%201'
        console.log(fen)
        // var url = 'https://www.chessdb.cn/cdb.php?action=querybest&board='+fen
        var url = 'https://chess-analysis-api.herokuapp.com/analysis?fen='+fen+'&depth=25&multiPv=2'
        chrome.runtime.sendMessage({url: url},function(response) {
            console.log(response.response);
            document.getElementById('puzzleAnswer').innerHTML = response.response
        });
    }
    // var divStr = '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <div><button class="side-panel-toggle" type="button"><span class="material-icons sp-icon-open">keyboard_double_arrow_left</span><span class="material-icons sp-icon-close">keyboard_double_arrow_right</span></button><div id="pz-ext" style="position: absolute;right: 0;width: 200px;top: 15%;z-index:99999;text-align: center;height: 100px;padding: 10px;color: #fff;background: #009578;"><button id="solvePuzzle">solve this puzzle</button><p style="color: #fff; padding: 15px;" id="puzzleAnswer"><p></div></div>'
    var divStr = '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <div class="wrapper side-panel-open"><button class="side-panel-toggle" type="button"><span class="material-icons sp-icon-open">keyboard_double_arrow_left</span><span class="material-icons sp-icon-close">keyboard_double_arrow_right</span></button><div class="side-panel"><button id="solvePuzzle" class="solve-btn">Solve</button><p style="color: #fff; padding: 25px; font-weight:600" id="puzzleAnswer"><p></div></div>'
    var newTag = document.createElement("div");
    newTag.innerHTML += divStr
    document.getElementsByTagName('body')[0].append(newTag);
    document.querySelector(".side-panel-toggle").addEventListener("click", () => {
        document.querySelector(".wrapper").classList.toggle("side-panel-open");
        document.querySelector(".side-panel-toggle").classList.toggle("change-pos");
      });      
    document.getElementById('solvePuzzle').addEventListener("click", function() {
        document.getElementById('puzzleAnswer').innerHTML = "Solving..."
        solvePuzzle()
    });         
})();
}