import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostsService } from '../post.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent {

  @Input() post: Post | null = null;
  @Output() cancel = new EventEmitter();
  @Output() updated = new EventEmitter();

  constructor(private postService: PostsService){}

  updatePost() {
    if (this.post) {
      // Atualiza o post localmente no serviço
      this.postService.updatePost(this.post.id, this.post);
      this.updated.emit();  // Emite o evento de atualização
      this.cancel.emit();   // Emite o evento de cancelamento
    }
  }

  getCancel(){
    this.cancel.emit();
  }

}
