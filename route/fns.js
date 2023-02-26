class pagenation{
    constructor(cpg,totalpage,ppg){
        this.cpg = cpg;
        this.totalpage= totalpage;
        this.ppg = ppg;
        this.alpg = Math.ceil(this.totalpage / this.ppg);
    }
    pages(){
        let cpg =  this.cpg;
        let alpg =  this.alpg;

        cpg = cpg ? parseInt(cpg) : 1;
    
        let stpgn = parseInt((cpg - 1) / 10) * 10 + 1; // 페이지네이션 시작값 계산
        let stpgns = [];
        for (let i = stpgn; i < stpgn + 10; ++i) {
            if (i <= alpg) {  // i가 총페이지수보다 같거나 작을때 i 출력
                let iscpg = (i == cpg) ? true : false;  // 현재페이지 표시
                let pgn = {'num': i, 'iscpg': iscpg};
                stpgns.push(pgn);
            }
        }
        return stpgns;
    }
    prevNext(){
        let cpg =  parseInt(this.cpg);
        let alpg =  parseInt(this.alpg);

        let isprev = (cpg - 1 > 0);  // 이전 버튼 표시 여부
        let isnext = (cpg < alpg);   // 다음 버튼 표시 여부
        let isprev10 = (cpg - 10 > 0);
        let isnext10 = (cpg + 10 < alpg);
        let pgn = {'prev': cpg - 1, 'next': cpg + 1, // 이전 : 현재페이지 - 1, 다음 : 현재페이지 + 1
                'prev10': cpg - 10, 'next10': cpg + 10,
                'isprev': isprev, 'isnext': isnext,
                'isprev10': isprev10, 'isnext10': isnext10};
        return pgn;
    }
}

module.exports =pagenation;