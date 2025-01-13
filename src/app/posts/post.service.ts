import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { NewPost, Post } from './post.model';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private post: Post[] = [];
  private url = environment.api;

  constructor(private httpClient: HttpClient) {
    this.loadPosts();
  }

  // Carregar posts do localStorage ou API
  private loadPosts() {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      this.post = JSON.parse(savedPosts);
    } else {
      this.getPostsFromApi();
    }
  }

  // Método para buscar posts da API e combinar com os locais
  private getPostsFromApi() {
    this.httpClient.get<Post[]>(`${this.url}/posts`).subscribe((posts) => {
      posts.forEach((post) => {
        const exists = this.post.some(
          (existingPost) => existingPost.id === post.id
        );
        if (!exists) {
          this.post.push(post);
        }
      });
      this.savePosts();
    });
  }

  // Método para buscar os posts locais
  getPosts(): Observable<Post[]> {
    return new Observable<Post[]>((observer) => {
      observer.next(this.post); // Retorna os posts locais já carregados
    });
  }

  // Método para criar posts e salvar no localStorage
  createPosts(post: NewPost): Observable<Post> {
    const uniquePostId = Date.now();

    // Adicionar o id gerado ao post
    const postWithId = { ...post, id: uniquePostId };

    return this.httpClient.post<Post>(this.url + '/posts', postWithId).pipe(
      tap((createdPost) => {
        const exists = this.post.some((p) => p.id === createdPost.id);
        if (!exists) {
          console.log('Post criado:', createdPost);
          this.post.push(createdPost);
          this.savePosts();
        } else {
          console.log('Post já existe, não foi adicionado novamente.');
        }
      })
    );
  }

  // Método para pegar um post por ID
  getUserPost(postId: number) {
    return this.post.filter((post) => post.id === postId);
  }

  // Método para atualizar um post localmente e no localStorage
  updatePost(postId: number, updatedPost: Post): void {
    const index = this.post.findIndex((post) => post.id === postId);

    console.log(
      `Procurando post com ID: ${postId}. Índice encontrado: ${index}`
    );

    if (index !== -1) {
      this.post[index] = { ...updatedPost };

      console.log(`Post atualizado: `, updatedPost);

      this.savePosts();
    } else {
      console.log(`Post com ID: ${postId} não encontrado.`);
    }
  }

  // Método para salvar os posts no localStorage
  private savePosts(): void {
    localStorage.setItem('posts', JSON.stringify(this.post));
  }

  // Método para buscar o nome do usuário
  getUserName(userId: number): Observable<string> {
    return this.httpClient
      .get<any>(`${this.url}/users/${userId}`)
      .pipe(map((user) => user.username));
  }

  // Método para excluir um post, tanto na API quanto localmente
  deletePost(postId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/posts/${postId}`).pipe(
      tap(() => {
        const index = this.post.findIndex((post) => post.id === postId);
        if (index !== -1) {
          this.post.splice(index, 1);
          this.savePosts();
        }
      })
    );
  }
}
