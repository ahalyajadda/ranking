function handleClick() {
  //fetching data from json file
  fetch('data.json', {
    mode: 'no-cors',
  }).then((res) => {
    res.json().then((data) => {
      //if the file file contains atleast one Skills
      if (data.length > 0) {
        let temp = '';
        //storing the percentages value in an array to find ranks of present and future.
        const present = [];
        const future = [];
        data.forEach((itemData) => {
          present.push(itemData.presentScore);
          future.push(itemData.futureScore);
        });
        //ranking the skills based on their percentages.
        const findRanks = (arr = []) => {
          const { length } = arr;
          let sortArray = arr.slice();
          sortArray.sort((a, b) => b - a);
          const result = [];
          for (let i = 0; i < length; i++) {
            const j = sortArray.indexOf(arr[i]);
            result.push(j + 1);
          }
          return result;
        };
        const res1 = findRanks(present);
        const res2 = findRanks(future);

        let i = 0;
        //initalized new arrays to store the top3 and bottom3 present and future skills.
        const presenttop3 = ['', '', ''];
        const futuretop3 = ['', '', ''];
        const presentbottom3 = ['', '', ''];
        const futurebottom3 = ['', '', ''];
        //initalized map to get the accelerated and declining skills
        const acceleratingMap = new Map();
        const goodOne = [];
        const badOne = [];

        let n = res1.length - 3;
        //storing top3 and bottom3 skills in the last table.
        data.forEach((itemData) => {
          itemData.presentRank = res1[i];
          itemData.futureRank = res2[i];
          acceleratingMap.set(
            itemData.Skills,
            itemData.futureScore - itemData.presentScore
          );
          if (res1[i] <= 3) presenttop3[res1[i] - 1] = itemData.Skills;
          if (res2[i] <= 3) futuretop3[res2[i] - 1] = itemData.Skills;
          if (res1[i] > n) presentbottom3[res1[i] - 10] = itemData.Skills;
          if (res2[i] > n) futurebottom3[res2[i] - 10] = itemData.Skills;
          i++;
        });
        //sorting the map to get top accelerated skills first.
        const maps = new Map(
          [...acceleratingMap.entries()].sort((a, b) => b[1] - a[1])
        );
        console.log(maps);
        let length = maps.size;
        let j = 0;
        //pushing accelerated and declined skills in the arrays.
        for (let [key, value] of maps) {
          if (j < 3) {
            goodOne.push(key);
          } else if (j >= length - 3) {
            badOne.push(key);
          }
          j++;
        }
        badOne.reverse();
        //printing the fist table data.
        data.forEach((itemData) => {
          temp += '<tr>';
          temp += '<td>' + itemData.Skills + '</td>';
          temp += '<td>' + itemData.presentScore + '%' + '</td>';
          temp += '<td>' + itemData.futureScore + '%' + '</td>';
          temp += '<td>' + itemData.presentRank + '</td>';
          temp += '<td>' + itemData.futureRank + '</td>';
          temp += '</tr>';
        });
        document.getElementById('fetched-data').innerHTML = temp;
        const skill = document.getElementById('skill').value;
        //printing the rank based on user input
        data.forEach((itemData) => {
          if (skill === itemData.Skills) {
            document.getElementById('rank').innerHTML =
              'Present rank ' +
              itemData.presentRank +
              ' future rank ' +
              itemData.futureRank;
          }
        });
        temp = '';
        //printing last table data
        for (let i = 0; i < presenttop3.length; i++) {
          temp += '<tr>';
          temp += '<td>' + presenttop3[i] + '</td>';
          temp += '<td>' + futuretop3[i] + '</td>';
          temp += '<td>' + presentbottom3[i] + '</td>';
          temp += '<td>' + futurebottom3[i] + '</td>';
          temp += '<td>' + goodOne[i] + '</td>';
          temp += '<td>' + badOne[i] + '</td>';

          temp += '</tr>';
        }
        document.getElementById('three-data').innerHTML = temp;
      }
    });
  });
}

handleClick();
