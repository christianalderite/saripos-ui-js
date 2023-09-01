  // const deduplicate = (a) => {
  //   var seen = {};
  //   var out = [];
  //   var len = a.length;
  //   var j = 0;
  //   for (var i = 0; i < len; i++) {
  //     var item = a[i];
  //     if (seen[item] !== 1) {
  //       seen[item] = 1;
  //       out[j++] = item;
  //     }
  //   }
  //   return out;
  // };

  // const filterData = (data, key) => {
  //   const items = data.map((item) => item[key]);
  //   const filtered = deduplicate(items);
  //   const object = filtered.map((item) => {
  //     return {
  //       text: item,
  //       value: item,
  //     };
  //   });
  //   return object;
  // };