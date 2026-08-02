import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { batchHistoryData } from '../../../core/services/batch-history-data';

@Component({

  selector: 'app-joining-status',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule

  ],

  templateUrl: './joining-status.html',

  styleUrl: './joining-status.css'

})

export class JoiningStatus {

  batchHistory = batchHistoryData;

  rejectionReasons = [

    'Medical Leave',

    'Training',

    'Election Duty',

    'Transferred',

    'Other'

  ];

  updateStatus(emp: any): void {

  if (emp.joined) {

    emp.status = 'Assigned';
    emp.isAssigned = true;

    emp.joinReason = '';
    emp.otherReason = '';

    return;

  }

  if (emp.joinReason) {

    emp.status = 'Unassigned';
    emp.isAssigned = false;

  }

  else {

    emp.status = 'Pending';
    emp.isAssigned = true;

  }

}

}