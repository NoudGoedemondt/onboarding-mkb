export default [
  {
    key: 'selfSchedule',
    label:
      'Wil je dat de klant zelf een afspraak inplant via een online portaal?',
    type: 'select',
    options: [
      {
        label:
          'Ja, de klant ontvangt een uitnodiging om zelf een afspraak in te plannen',
        value: true,
      },
      {
        label: 'Nee, een planner plant de afspraak vooraf in',
        value: false,
      },
    ],
  },
  {
    key: 'confirmAppointment',
    label:
      'Wil je een vooraf geplande afspraak laten bevestigen door de klant?',
    type: 'select',
    options: [
      {
        label:
          'Ja, de klant moet expliciet bevestigen voordat de afspraak definitief is',
        value: true,
      },
      {
        label: 'Nee, de afspraak wordt automatisch definitief',
        value: false,
      },
    ],
    condition: '$.selfSchedule = false',
  },
  {
    key: 'followUp',
    label:
      'Wil je automatische opvolgingen versturen als de klant niet reageert?',
    type: 'select',
    options: [
      {
        label:
          'Ja, de klant ontvangt opvolgingen om hun afspraak te bevestigen',
        value: true,
      },
      {
        label: 'Nee, de klant ontvangt een enkele bevestiging',
        value: false,
      },
    ],
  },
  {
    key: 'revisit',
    label:
      'Moeten vervolgbezoeken ingepland worden als het eerste bezoek niet succesvol is?',
    type: 'select',
    options: [
      {
        label:
          'Ja, vervolgbezoeken worden opnieuw ingepland tot de afspraak is uitgevoerd of deze handmatig wordt gesloten',
        value: true,
      },
      {
        label:
          'Nee, afspraken zijn direct uitvoerbaar en vereisen geen herplanning',
        value: false,
      },
    ],
  },
  {
    key: 'reminders',
    label: 'Wil je de klant herinneringen sturen voorafgaand aan de afspraak?',
    type: 'select',
    options: [
      {
        label: 'Ja, de klant krijgt herinneringen vóór de afspraak',
        value: true,
      },
      {
        label: 'Nee, geen herinneringen',
        value: false,
      },
    ],
  },
  {
    key: 'afterMessage',
    label:
      'Wil je de klant een bericht sturen na afronding van de werkopdracht?',
    type: 'select',
    options: [
      {
        label: 'Ja, de klant ontvangt een samenvatting',
        value: 'summary',
      },
      {
        label: 'Ja, de klant ontvangt een bevestiging',
        value: 'confirmation',
      },
      {
        label: 'Nee, de klant ontvangt geen bericht',
        value: 'none',
      },
    ],
  },
  {
    key: 'preInspection',
    label: 'Moet er een schouwing plaatsvinden vóór de echte uitvoering?',
    type: 'select',
    options: [
      {
        label: 'Ja, schouwing verplicht',
        value: true,
      },
      {
        label: 'Nee, direct uitvoeren',
        value: false,
      },
    ],
  },
  {
    key: 'qcAfter',
    label:
      'Moet er na uitvoering een kwaliteitscontrole of goedkeuring plaatsvinden?',
    type: 'select',
    options: [
      {
        label: 'Ja, door een planner/technicus',
        value: true,
      },
      {
        label: 'Nee, werkopdracht wordt direct gesloten',
        value: false,
      },
    ],
  },
  {
    key: 'autoCloseDays',
    label:
      'Na hoeveel dagen moet een werkopdracht automatisch worden gesloten?',
    type: 'number',
  },
];
