#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #pragma comment(lib, "ws2_32.lib")
    typedef int socklen_t;
#else
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <unistd.h>
    #include <arpa/inet.h>
    #define SOCKET int
    #define INVALID_SOCKET -1
    #define SOCKET_ERROR -1
    #define closesocket close
#endif

#define BUFFER_SIZE 3000000

// ==========================================
// DATA STRUCTURES
// ==========================================
typedef struct Deity {
    char id[15]; char name[100]; char district[100]; char village[200];
    char history[10000]; char image[2000]; char video[1000]; char map[1000]; char links[1000];
    char gurName[200]; char travelGuide[2000]; char devKhel[2000]; char oracleRecords[2000];
    struct Deity* next;
} Deity;
Deity* deityHead = NULL;

typedef struct Event {
    char deityId[15]; char title[100]; char date[20]; char description[1000];
    char location[150]; char map[500];
    struct Event* next;
} Event;
Event* eventHead = NULL;

typedef struct Slide {
    char id[10]; char title[200]; char subtitle[300]; char imageUrl[1000]; char deityId[15];
    struct Slide* next;
} Slide;
Slide* slideHead = NULL;

void trim(char* str) {
    if (!str) return;
    int len = strlen(str);
    while(len > 0 && (str[len-1] == ' ' || str[len-1] == '\r' || str[len-1] == '\n' || str[len-1] == '\t')) {
        str[--len] = '\0';
    }
    char* start = str;
    while(*start == ' ' || *start == '\t') {
        start++;
    }
    if (start != str) {
        memmove(str, start, strlen(start) + 1);
    }
}

void addDeity(const char* id, const char* name, const char* district, const char* village, const char* history, const char* image, const char* video, const char* map, const char* links, const char* gur, const char* travel, const char* khel, const char* oracle) {
    Deity* existing = deityHead;
    while(existing) {
        if(strcmp(existing->id, id) == 0) {
            strcpy(existing->name, name); strcpy(existing->district, district);
            strcpy(existing->village, village); strcpy(existing->history, history);
            strcpy(existing->image, image); strcpy(existing->video, video);
            strcpy(existing->map, map); strcpy(existing->links, links);
            strcpy(existing->gurName, gur); strcpy(existing->travelGuide, travel);
            strcpy(existing->devKhel, khel); strcpy(existing->oracleRecords, oracle);
            return;
        }
        existing = existing->next;
    }
    Deity* newDeity = (Deity*)malloc(sizeof(Deity));
    strcpy(newDeity->id, id); strcpy(newDeity->name, name); strcpy(newDeity->district, district);
    strcpy(newDeity->village, village); strcpy(newDeity->history, history);
    strcpy(newDeity->image, image); strcpy(newDeity->video, video);
    strcpy(newDeity->map, map); strcpy(newDeity->links, links);
    strcpy(newDeity->gurName, gur); strcpy(newDeity->travelGuide, travel);
    strcpy(newDeity->devKhel, khel); strcpy(newDeity->oracleRecords, oracle);
    newDeity->next = deityHead;
    deityHead = newDeity;
}

void addSlide(const char* id, const char* title, const char* subtitle, const char* imageUrl, const char* deityId) {
    Slide* newSlide = (Slide*)malloc(sizeof(Slide));
    strcpy(newSlide->id, id); strcpy(newSlide->title, title);
    strcpy(newSlide->subtitle, subtitle); strcpy(newSlide->imageUrl, imageUrl);
    strcpy(newSlide->deityId, deityId);
    newSlide->next = slideHead;
    slideHead = newSlide;
}

void addEvent(const char* deityId, const char* title, const char* date, const char* description, const char* location, const char* map) {
    Event* newEvent = (Event*)malloc(sizeof(Event));
    strcpy(newEvent->deityId, deityId); strcpy(newEvent->title, title);
    strcpy(newEvent->date, date); strcpy(newEvent->description, description);
    strcpy(newEvent->location, location); strcpy(newEvent->map, map);
    newEvent->next = eventHead;
    eventHead = newEvent;
}

// ==========================================
// FILE I/O
// ==========================================
void saveDatabase() {
    FILE* file = fopen("kuldev_db.tsv", "w");
    if(!file) return;
    Deity* curr = deityHead;
    while(curr) {
        fprintf(file, "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n", 
                curr->id, curr->name, curr->district, curr->village, curr->history, 
                curr->image, curr->video, curr->map, curr->links,
                curr->gurName, curr->travelGuide, curr->devKhel, curr->oracleRecords);
        curr = curr->next;
    }
    fclose(file);
}

void saveSlides() {
    FILE* file = fopen("hero_slides.tsv", "w");
    if(!file) return;
    Slide* curr = slideHead;
    while(curr) {
        fprintf(file, "%s\t%s\t%s\t%s\t%s\n", curr->id, curr->title, curr->subtitle, curr->imageUrl, curr->deityId);
        curr = curr->next;
    }
    fclose(file);
}

void loadDatabase() {
    FILE* file = fopen("kuldev_db.tsv", "r");
    if(!file) { printf("Error: kuldev_db.tsv not found\n"); return; }
    char* line = (char*)malloc(500000);
    while(fgets(line, 500000, file)) {
        char id[15]="", name[100]="", dist[100]="", vill[200]="", hist[10000]="", img[2000]="", vid[1000]="", map[1000]="", lnk[1000]="", gur[200]="", trv[2000]="", khl[2000]="", orc[2000]="";
        int len = strlen(line); if(len > 0 && line[len-1] == '\n') line[len-1] = '\0';
        char* cursor = line;
        #define GET_FIELD_SAFE(dest, size) if (cursor) { char* end = strchr(cursor, '\t'); if (end) { *end = '\0'; strncpy(dest, cursor, size-1); dest[size-1]='\0'; cursor = end + 1; } else { strncpy(dest, cursor, size-1); dest[size-1]='\0'; cursor = NULL; } }
        GET_FIELD_SAFE(id, 15); GET_FIELD_SAFE(name, 100); GET_FIELD_SAFE(dist, 100); GET_FIELD_SAFE(vill, 200); 
        GET_FIELD_SAFE(hist, 10000); GET_FIELD_SAFE(img, 2000); GET_FIELD_SAFE(vid, 1000); GET_FIELD_SAFE(map, 1000); GET_FIELD_SAFE(lnk, 1000);
        GET_FIELD_SAFE(gur, 200); GET_FIELD_SAFE(trv, 2000); GET_FIELD_SAFE(khl, 2000); GET_FIELD_SAFE(orc, 2000);
        if(strlen(id)>0) addDeity(id, name, dist, vill, hist, img, vid, map, lnk, gur, trv, khl, orc);
    }
    free(line);
    fclose(file);
    printf("Loaded Database\n");
}

void loadSlides() {
    FILE* file = fopen("hero_slides.tsv", "r");
    if(!file) return;
    char line[5000];
    while(fgets(line, sizeof(line), file)) {
        char id[10]="", title[200]="", sub[500]="", img[1000]="", did[15]="";
        int len = strlen(line); if(len > 0 && line[len-1] == '\n') line[len-1] = '\0';
        char* cursor = line;
        #define GET_FIELD_S(dest, size) if (cursor) { char* end = strchr(cursor, '\t'); if (end) { *end = '\0'; strncpy(dest, cursor, size-1); dest[size-1]='\0'; cursor = end + 1; } else { strncpy(dest, cursor, size-1); dest[size-1]='\0'; cursor = NULL; } }
        GET_FIELD_S(id, 10); GET_FIELD_S(title, 200); GET_FIELD_S(sub, 500); GET_FIELD_S(img, 1000); GET_FIELD_S(did, 15);
        if(strlen(id)>0) addSlide(id, title, sub, img, did);
    }
    fclose(file);
    printf("Loaded Slides\n");
}

void loadEvents() {
    FILE* file = fopen("events.tsv", "r");
    if(!file) return;
    char line[5000];
    while(fgets(line, sizeof(line), file)) {
        char did[15]="", title[100]="", date[20]="", desc[1000]="", loc[150]="", map[500]="";
        int len = strlen(line); if(len > 0 && line[len-1] == '\n') line[len-1] = '\0';
        char* cursor = line;
        #define GET_FIELD_E(dest, size) if (cursor) { char* end = strchr(cursor, '\t'); if (end) { *end = '\0'; strncpy(dest, cursor, size-1); dest[size-1]='\0'; cursor = end + 1; } else { strncpy(dest, cursor, size-1); dest[size-1]='\0'; cursor = NULL; } }
        GET_FIELD_E(did, 15); GET_FIELD_E(title, 100); GET_FIELD_E(date, 20); GET_FIELD_E(desc, 1000); GET_FIELD_E(loc, 150); GET_FIELD_E(map, 500);
        if(strlen(did)>0) addEvent(did, title, date, desc, loc, map);
    }
    fclose(file);
    printf("Loaded Events\n");
}

// ==========================================
// SERVER LOGIC
// ==========================================
void extractJsonString(const char* json, const char* key, char* output, int maxLen) {
    char searchKey[100]; sprintf(searchKey, "\"%s\":\"", key);
    char* start = strstr(json, searchKey);
    if(start) {
        start += strlen(searchKey); char* end = strstr(start, "\"");
        if(end) { int len = end - start; if(len >= maxLen) len = maxLen - 1; strncpy(output, start, len); output[len] = '\0'; return; }
    }
    output[0] = '\0';
}

void sendResponse(SOCKET client, const char* contentType, const char* body) {
    char header[512];
    sprintf(header, "HTTP/1.1 200 OK\r\nContent-Type: %s\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: %zu\r\nConnection: close\r\n\r\n", contentType, strlen(body));
    send(client, header, strlen(header), 0);
    send(client, body, strlen(body), 0);
}

void sendFileResponse(SOCKET client, const char* contentType, const char* filePath) {
    FILE* f = fopen(filePath, "rb");
    if (!f) {
        const char* nf = "HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n";
        send(client, nf, strlen(nf), 0);
        return;
    }
    fseek(f, 0, SEEK_END); long size = ftell(f); fseek(f, 0, SEEK_SET);
    char* fileBuf = (char*)malloc(size + 1);
    if (fileBuf) {
        fread(fileBuf, 1, size, f); fileBuf[size] = '\0';
        char header[512];
        sprintf(header, "HTTP/1.1 200 OK\r\nContent-Type: %s\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: %ld\r\nConnection: close\r\n\r\n", contentType, size);
        send(client, header, strlen(header), 0);
        send(client, fileBuf, size, 0);
        free(fileBuf);
    }
    fclose(f);
}

void cleanJson(char* str) {
    for(int i=0; str[i]; i++) { 
        if(str[i]=='\n'||str[i]=='\r'||str[i]=='\t') str[i]=' '; 
        if(str[i]=='"') str[i]='\''; 
    }
}

void handleClient(SOCKET clientSocket) {
    char* buffer = (char*)malloc(BUFFER_SIZE);
    int bytesReceived = recv(clientSocket, buffer, BUFFER_SIZE - 1, 0);
    if (bytesReceived > 0) {
        buffer[bytesReceived] = '\0';
        if (strncmp(buffer, "OPTIONS", 7) == 0) {
            const char* res = "HTTP/1.1 240 No Content\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: GET, POST, DELETE, OPTIONS\r\nAccess-Control-Allow-Headers: Content-Type\r\nConnection: close\r\n\r\n";
            send(clientSocket, res, strlen(res), 0);
        }
        else if (strncmp(buffer, "GET /api/deities", 16) == 0) {
            char* jsonBody = (char*)malloc(BUFFER_SIZE); strcpy(jsonBody, "[");
            Deity* curr = deityHead;
            while(curr) {
                char temp[12288];
                char h[10000], g[200], t[2000], k[2000], o[2000];
                strcpy(h, curr->history); cleanJson(h);
                strcpy(g, curr->gurName); cleanJson(g);
                strcpy(t, curr->travelGuide); cleanJson(t);
                strcpy(k, curr->devKhel); cleanJson(k);
                strcpy(o, curr->oracleRecords); cleanJson(o);
                
                sprintf(temp, "{\"id\":\"%s\",\"name\":\"%s\",\"district\":\"%s\",\"village\":\"%s\",\"history\":\"%s\",\"image\":\"%s\",\"video\":\"%s\",\"map\":\"%s\",\"gurName\":\"%s\",\"travelGuide\":\"%s\",\"devKhel\":\"%s\",\"oracleRecords\":\"%s\"}",
                        curr->id, curr->name, curr->district, curr->village, h, curr->image, curr->video, curr->map, g, t, k, o);
                strcat(jsonBody, temp); curr = curr->next; if(curr) strcat(jsonBody, ",");
            }
            strcat(jsonBody, "]"); sendResponse(clientSocket, "application/json", jsonBody); free(jsonBody);
        }
        else if (strncmp(buffer, "GET /api/slides", 15) == 0) {
            char* jsonBody = (char*)malloc(BUFFER_SIZE); strcpy(jsonBody, "[");
            Slide* curr = slideHead;
            while(curr) {
                char temp[2048];
                sprintf(temp, "{\"id\":\"%s\",\"title\":\"%s\",\"subtitle\":\"%s\",\"imageUrl\":\"%s\",\"deityId\":\"%s\"}", curr->id, curr->title, curr->subtitle, curr->imageUrl, curr->deityId);
                strcat(jsonBody, temp); curr = curr->next; if(curr) strcat(jsonBody, ",");
            }
            strcat(jsonBody, "]"); sendResponse(clientSocket, "application/json", jsonBody); free(jsonBody);
        }
        else if (strncmp(buffer, "POST /api/slides", 16) == 0) {
            char* body = strstr(buffer, "\r\n\r\n");
            if (body) {
                body += 4;
                char sid[10], stit[200], ssub[300], simg[1000], sdid[15];
                extractJsonString(body, "id", sid, 10); extractJsonString(body, "title", stit, 200);
                extractJsonString(body, "subtitle", ssub, 300); extractJsonString(body, "imageUrl", simg, 1000);
                extractJsonString(body, "deityId", sdid, 15);
                if(strlen(sid)>0) { addSlide(sid, stit, ssub, simg, sdid); saveSlides(); }
            }
            sendResponse(clientSocket, "application/json", "{\"status\":1}");
        }
        else if (strncmp(buffer, "POST /api/contributions", 23) == 0) {
            char* body = strstr(buffer, "\r\n\r\n");
            if (body) {
                FILE* f = fopen("contributions.tsv", "a");
                if(f) { fprintf(f, "%s\n", body+4); fclose(f); }
            }
            sendResponse(clientSocket, "application/json", "{\"status\":\"Success. Contribution pending approval.\"}");
        }
        else if (strncmp(buffer, "POST /api/deities", 17) == 0) {
            char* body = strstr(buffer, "\r\n\r\n");
            if (body) {
                body += 4;
                char id[15], name[100], district[100], village[200], history[10000], image[2000], video[1000], map[1000], gur[200], trv[2000], khl[2000], orc[2000];
                extractJsonString(body, "id", id, 15); extractJsonString(body, "name", name, 100);
                extractJsonString(body, "district", district, 100); extractJsonString(body, "village", village, 200);
                extractJsonString(body, "history", history, 10000); extractJsonString(body, "image", image, 2000);
                extractJsonString(body, "video", video, 1000); extractJsonString(body, "map", map, 1000);
                extractJsonString(body, "gurName", gur, 200); extractJsonString(body, "travelGuide", trv, 2000);
                extractJsonString(body, "devKhel", khl, 2000); extractJsonString(body, "oracleRecords", orc, 2000);
                if(strlen(id)>0) { addDeity(id, name, district, village, history, image, video, map, "", gur, trv, khl, orc); saveDatabase(); }
            }
            sendResponse(clientSocket, "application/json", "{\"status\":1}");
        }
        else {
            // Serve static files relative to execution directory
            char path[512] = ".";
            char* requestPath = strtok(buffer + 4, " ");
            if (strcmp(requestPath, "/") == 0) strcat(path, "/index.html");
            else strcat(path, requestPath);
            
            const char* ext = strrchr(path, '.');
            const char* type = "text/plain";
            if (ext) {
                if (strcmp(ext, ".html") == 0) type = "text/html";
                else if (strcmp(ext, ".css") == 0) type = "text/css";
                else if (strcmp(ext, ".js") == 0) type = "application/javascript";
                else if (strcmp(ext, ".png") == 0) type = "image/png";
                else if (strcmp(ext, ".jpg") == 0 || strcmp(ext, ".jpeg") == 0) type = "image/jpeg";
            }
            sendFileResponse(clientSocket, type, path);
        }
    }
    free(buffer); closesocket(clientSocket);
}

int main() {
    loadDatabase(); loadEvents(); loadSlides();
    
    int port = 8080;
    char* portEnv = getenv("PORT");
    if (portEnv) port = atoi(portEnv);

#ifdef _WIN32
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        printf("WSAStartup failed.\n");
        return 1;
    }
#endif

    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket == INVALID_SOCKET) {
#ifdef _WIN32
        printf("Socket creation failed: %d\n", WSAGetLastError());
        WSACleanup();
#else
        perror("Socket creation failed");
#endif
        return 1;
    }

    int opt = 1;
    setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, (const char*)&opt, sizeof(opt));

    struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port);

    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
#ifdef _WIN32
        printf("Bind failed with error: %d\n", WSAGetLastError());
        closesocket(serverSocket);
        WSACleanup();
#else
        perror("Bind failed");
        close(serverSocket);
#endif
        return 1;
    }

    if (listen(serverSocket, SOMAXCONN) == SOCKET_ERROR) {
#ifdef _WIN32
        printf("Listen failed with error: %d\n", WSAGetLastError());
        closesocket(serverSocket);
        WSACleanup();
#else
        perror("Listen failed");
        close(serverSocket);
#endif
        return 1;
    }

    printf("🔱 HIM-GATHA Cloud Server Listening on port %d\n", port);
    
    while (1) {
        struct sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);
        SOCKET clientSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &clientLen);
        if (clientSocket != INVALID_SOCKET) {
            handleClient(clientSocket);
        }
    }

#ifdef _WIN32
    WSACleanup();
#endif
    return 0;
}
