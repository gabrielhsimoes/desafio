import { Component, OnInit } from '@angular/core';
import { PostsService } from './post.service';
import { Post } from './post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  post: Post[] = [];
  abrirModal = false;
  postSelecionado: Post | null = null;
  usernames: { [key: number]: string } = {};

  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.postService.getPosts().subscribe((posts) => {
      this.post = posts.sort((a, b) => b.id - a.id);

      // Para cada post, buscar o nome do usuário
      posts.forEach((post) => {
        const userId = Number(post.userId);
        if (!isNaN(userId)) {
          this.postService.getUserName(userId).subscribe((username) => {
            this.usernames[userId] = username;
          });
        }
      });
    });
  }

  onPostCreated(newPost: Post) {
    this.post.unshift(newPost);
  }

  onModalPost(postId: number) {
    this.postSelecionado = this.post.find((post) => post.id === postId) || null;
    this.abrirModal = true;
  }

  cancelModalPost() {
    this.abrirModal = false;
    this.postSelecionado = null;
  }

  getUsernameForPost(postId: number): string {
    const post = this.post.find((post) => post.id === postId);
    if (post && post.userId !== undefined) {
      return this.usernames[post.userId] || 'Usuário Desconhecido';
    }
    return 'Usuário Desconhecido';
  }

  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        console.log('Post excluído com sucesso!');
        this.getPosts();
      },
      error: (err) => {
        console.error('Erro ao excluir o post:', err);
      },
    });
  }

  onPostUpdated(updatedPost: Post) {
    const index = this.post.findIndex((post) => post.id === updatedPost.id);
    if (index !== -1) {
      this.post[index] = updatedPost;
    }
  }
}
