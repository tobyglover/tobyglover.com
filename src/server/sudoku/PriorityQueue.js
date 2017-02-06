function Node() {
	this.next;
	this.data;
}

class PriorityQueue {
	
	constructor() {
		this.queue = null;
	}

	add(row, col, set) {
		var n = new Node();
		n.data = {'row':row, 'col':col, 'set': set};

		if (this.queue == null) {
			this.queue = n;
		} else {
			var tmp = this.queue;
			var prev = null;

			while (tmp != null && tmp.data.set.size < set.size) {
				prev = tmp;
				tmp = tmp.next;
			}

			n.next = tmp;
			if (prev) {
				prev.next = n;
			}
		}
	}

	pop() {
		var data;

		if (this.queue != null) {
			data = this.queue.data;

			this.queue = this.queue.next;
		}

		return data;
	}

	print() {
		var tmp = this.queue;
		console.log();
		while (tmp != null) {
			console.log(tmp.data);
			tmp = tmp.next;
		}
	}
}

module.exports = PriorityQueue;