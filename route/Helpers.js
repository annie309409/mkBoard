helpsers={
    section: function(name, options) {
    if(!this._sections) this._sections = {}
    this._sections[name] = options.fn(this)
    return null
    },
    eq: function(a,b){
        if(a===b){
            return true;
        }else{
            return false;
        }
    }
}

module.exports = helpsers;