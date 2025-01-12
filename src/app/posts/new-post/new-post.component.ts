import { Component, EventEmitter, Output } from '@angular/core';
import { PostsService } from '../post.service';
import { NewPost } from '../post.model';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent {
  title = '';
  post = '';

  @Output() postCreated = new EventEmitter();

  constructor(private postService: PostsService) {}

  createPost() {
    const newPost: NewPost = { title: this.title, body: this.post, userId: 1 }; // Adicionando userId
    this.postService.createPosts(newPost).subscribe(
      (createdPost) => {
        this.postCreated.emit(createdPost);
        this.title = '';
        this.post = '';
      },
      (error) => {
        console.error('Erro ao criar o post', error); // Adicionando um tratamento de erro
      }
    );
  }

}
