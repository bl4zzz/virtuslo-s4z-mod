import * as common from '/pages/src/common.mjs';

export async function main() {
    common.initInteractionListeners();

	const vsDataHead = document.querySelector('div#data-head');
	const vsData = document.querySelector('div#data');
	const vsDataAlt = document.querySelector('div#data-alt');
	
	const box1 = document.getElementById('box1');
	const box2 = document.getElementById('box2');
	const box3 = document.getElementById('box3');
	
	box1.style.display = 'none';
	box2.style.display = 'none';
	box3.style.display = 'none';
	
	let time = []
	let data = [];
	let athleteId = 0;

    common.subscribe('athlete/watching', ad => {

		//reset data
		if (ad.athleteId != athleteId) {
			time = []
			data = [];
			athleteId = ad.athleteId;
		}
		
		let now = Math.round(ad.state.worldTime/1000);
		time.push(now);
		data.push(ad.state.power);
		let avg = averageSince(now-10);

		if (ad.state.draft > 0) {
			box2.style.display = 'block';
			
			box1.style.display = 'none';
			box3.style.display = 'none';
		
			vsDataHead.innerHTML = "Draft";
			
			vsData.innerHTML = ad.state.draft;
		} else {
			let diff = Math.round( ad.state.power - (avg*1.1) );
			
			if (diff > 0) {
				vsDataHead.innerHTML = "ON Target";
				box1.style.display = 'block';
				
				box2.style.display = 'none';
				box3.style.display = 'none';
			} else {
				vsDataHead.innerHTML = "Below Target";
				box3.style.display = 'block';
				
				box1.style.display = 'none';
				box2.style.display = 'none';
			}
			vsData.innerHTML = Math.round(avg*1.1) + "w";
		}

		vsDataAlt.innerHTML = "Power (10s): " + avg + "w";
	});
	
	function averageSince(from) {
		let splitAt = 0;
		
		for(let i=0; i<time.length; i++) {
			if (time[i] < from) {
				splitAt = i;
			}
		}
		
		if (splitAt > 0) {
			time = time.slice(splitAt);
			data = data.slice(splitAt);
		}
		
		let total = 0;
		for(let i=0; i<data.length; i++) {
			total += data[i];
		}
	
		return Math.round(total/data.length);
	}
}
