class Activity {
    constructor(term) {
        this.name = term;
        this.count = 1;
        this.next = [];
    }

    getIndex(term) {
        //console.log("Length " + this.next.length);
        for (var i in this.next) {
            //console.log("Comparing " + term + " and " + this.next[i].name);
            if (this.next[i].name == term) {
                return i;
            }
        }

        return -1;
    }

    
    addDescription(info) {
        var index = this.getIndex(info);

        if (index == -1) {
            //console.log("adding " + info +" first time");
            this.next.push(new Activity(info));
        } else {
            //var index = getIndex(info);
            //if (index != -1) {
                //console.log("Increasing for " + info);
                this.next[index].increaseCount();
            //}
        }
    }

    increaseCount() {
        this.count = this.count + 1;
    }
}

module.exports = Activity;