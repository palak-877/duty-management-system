import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { batchHistoryData } from '../../../core/services/batch-history-data';

@Component({
  selector: 'app-batch-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './batch-history.html',
  styleUrl: './batch-history.css'
})
export class BatchHistory {

  batchHistory = batchHistoryData;
expandedBatch: any = null;

toggleBatch(batch: any): void {

  if (this.expandedBatch === batch) {

    this.expandedBatch = null;

  } else {

    this.expandedBatch = batch;

  }

}
}