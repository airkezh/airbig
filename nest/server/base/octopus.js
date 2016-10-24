
exports.run = function(fn ){
	return function(onDone){
		function thunk(tfn , ctx){
			return function(sql , id){
				var args = Array.prototype.slice.call(arguments , 0)
				args.push(cbk)
				tfn.apply(ctx , args)
			}
		
		}

		function cbk(err , result) {
			if (err) return onDone(err)
			next(result)	
		}

		function next(resultPre){
			var cur = generator.next(resultPre)
			if (cur.done) onDone(null , cur.value)
		}

		var generator = fn(thunk)
		next()
	}
}
