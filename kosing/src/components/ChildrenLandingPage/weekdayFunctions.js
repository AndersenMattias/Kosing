export function calcValueDay(day) {
  switch (day) {
    case 'monday':
      return 1;
    case 'tuesday':
      return 2;
    case 'wednesday':
      return 3;
    case 'thursday':
      return 4;
    case 'friday':
      return 5;
    case 'saturday':
      return 6;
    case 'sunday':
      return 7;
    case 'anyday':
      // Sorterar anyday till samma dag som dagen är "på riktigt"
      if (new Date(Number(Date.now())).toString().split(' ')[0] === 'Mon')
        return 1.5;
      if (new Date(Number(Date.now())).toString().split(' ')[0] === 'Tue')
        return 2.5;
      if (new Date(Number(Date.now())).toString().split(' ')[0] === 'Wed')
        return 3.5;
      if (new Date(Number(Date.now())).toString().split(' ')[0] === 'Thu')
        return 4.5;
      if (new Date(Number(Date.now())).toString().split(' ')[0] === 'Fri')
        return 5.5;
      if (new Date(Number(Date.now())).toString().split(' ')[0] === 'Sat')
        return 6.5;
      if (new Date(Number(Date.now())).toString().split(' ')[0] === 'Sun')
        return 7.5;
      // returnerar 8 om något blir fel (sist i listan)
      return 8;
    default:
      return;
  }
}
