import { Pipe, PipeTransform } from '@angular/core';
import {marked } from 'marked'

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {

  public transform(value: string | undefined): string {
    return marked.parse(value || '') as string;
  }

}
