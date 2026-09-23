import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getTodayIST,
  getEventStatus,
  formatEventDate,
  groupAndSortEvents
} from '../src/utils/eventLifecycle.js';

test('getTodayIST returns valid date structure in Asia/Kolkata timezone', () => {
  // Midnight UTC on 2026-09-22 is 05:30 AM IST on 2026-09-22
  const dateUtc = new Date('2026-09-21T20:00:00.000Z'); // 01:30 AM IST on Sep 22
  const ist = getTodayIST(dateUtc);
  assert.equal(ist.dateStr, '2026-09-22');
  assert.equal(ist.year, 2026);
  assert.equal(ist.month, 9);
  assert.equal(ist.day, 22);
});

test('getEventStatus correctly identifies UPCOMING, HAPPENING_NOW, COMPLETED, DATE_TBA', () => {
  const refDate = new Date('2026-10-15T10:00:00+05:30'); // October 15, 2026

  // Exact upcoming event
  const upcomingEvent = {
    title: 'Kullu Dussehra',
    startDate: '2026-10-22',
    endDate: '2026-10-28',
    datePrecision: 'exact'
  };
  assert.equal(getEventStatus(upcomingEvent, refDate), 'UPCOMING');

  // Exact ongoing event
  const ongoingEvent = {
    title: 'Autumn Mela',
    startDate: '2026-10-14',
    endDate: '2026-10-20',
    datePrecision: 'exact'
  };
  assert.equal(getEventStatus(ongoingEvent, refDate), 'HAPPENING_NOW');

  // Exact past event
  const pastEvent = {
    title: 'Baisakhi Mela',
    date: '2026-04-13',
    datePrecision: 'exact'
  };
  assert.equal(getEventStatus(pastEvent, refDate), 'COMPLETED');

  // TBA event
  const tbaEvent = {
    title: 'Unconfirmed Fair',
    datePrecision: 'tba',
    year: 2027
  };
  assert.equal(getEventStatus(tbaEvent, refDate), 'DATE_TBA');
});

test('formatEventDate formats single dates and date ranges respectfully without fabrication', () => {
  // Exact single date
  assert.equal(
    formatEventDate({ date: '2026-08-15', datePrecision: 'exact' }),
    '15 August 2026'
  );

  // Exact same-month range
  assert.equal(
    formatEventDate({
      startDate: '2026-10-14',
      endDate: '2026-10-20',
      datePrecision: 'exact'
    }),
    '14–20 October 2026'
  );

  // Exact cross-month range
  assert.equal(
    formatEventDate({
      startDate: '2026-10-28',
      endDate: '2026-11-03',
      datePrecision: 'exact'
    }),
    '28 October – 3 November 2026'
  );

  // Month-level precision
  assert.equal(
    formatEventDate({ startDate: '2026-10', datePrecision: 'month' }),
    'October 2026'
  );

  // Seasonal precision
  assert.equal(
    formatEventDate({ season: 'Usually October / Autumn Harvest', datePrecision: 'seasonal' }),
    'Usually October / Autumn Harvest'
  );

  // TBA precision
  assert.equal(
    formatEventDate({ year: 2027, datePrecision: 'tba' }),
    '2027 date to be announced'
  );
});

test('groupAndSortEvents correctly partitions into UI hierarchy and sorts chronologically', () => {
  const refDate = new Date('2026-09-22T10:00:00+05:30'); // Sep 22, 2026

  const events = [
    { id: '1', title: 'Past Event', date: '2026-08-15' },
    { id: '2', title: 'Upcoming 1', date: '2026-10-22' },
    { id: '3', title: 'Upcoming 2', date: '2026-10-15' },
    { id: '4', title: 'Happening Now', startDate: '2026-09-20', endDate: '2026-09-25' },
    { id: '5', title: 'Seasonal Fair', season: 'Usually October', datePrecision: 'seasonal' },
    { id: '6', title: 'TBA Fair', datePrecision: 'tba', year: 2027 }
  ];

  const grouped = groupAndSortEvents(events, refDate);

  assert.equal(grouped.happeningNow.length, 1);
  assert.equal(grouped.happeningNow[0].id, '4');

  assert.equal(grouped.upcoming.length, 2);
  assert.equal(grouped.upcoming[0].id, '3'); // Oct 15 before Oct 22
  assert.equal(grouped.upcoming[1].id, '2');

  assert.equal(grouped.laterThisSeason.length, 1);
  assert.equal(grouped.laterThisSeason[0].id, '5');

  assert.equal(grouped.past.length, 1);
  assert.equal(grouped.past[0].id, '1');

  assert.equal(grouped.tba.length, 1);
  assert.equal(grouped.tba[0].id, '6');
});
