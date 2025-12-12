import { Navbar } from "@/components/navigation/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, BookOpen, Video, FileQuestion, CreditCard, User, HelpCircle } from "lucide-react";
import { useState, useMemo } from "react";

interface FAQItem {
  id: string;
  question: string;
  reponse: string;
  categorie: string;
  formateur?: string;
}

const faqData: FAQItem[] = [
  // Catégorie: Inscription et Connexion
  {
    id: "faq-1",
    question: "Comment créer mon compte apprenant ?",
    reponse: "Votre compte est créé par votre collectivité locale. Contactez l'administrateur de votre collectivité pour obtenir vos identifiants de connexion (code et mot de passe).",
    categorie: "Inscription et Connexion",
    formateur: "Équipe Support"
  },
  {
    id: "faq-2",
    question: "J'ai oublié mon mot de passe, que faire ?",
    reponse: "Contactez votre collectivité locale ou l'administrateur de la plateforme. Ils pourront réinitialiser votre mot de passe et vous fournir de nouveaux identifiants.",
    categorie: "Inscription et Connexion",
    formateur: "Équipe Support"
  },
  {
    id: "faq-3",
    question: "Puis-je changer mon mot de passe ?",
    reponse: "Oui, une fois connecté, vous pouvez modifier votre mot de passe depuis votre profil. Si vous rencontrez des difficultés, contactez le support.",
    categorie: "Inscription et Connexion",
    formateur: "Équipe Support"
  },
  
  // Catégorie: Cours et Formations
  {
    id: "faq-4",
    question: "Comment accéder à un cours ?",
    reponse: "Allez dans 'Mes Cours' depuis votre tableau de bord. Vous verrez tous les cours disponibles selon vos crédits. Cliquez sur 'Lancer le cours' pour commencer. Assurez-vous d'avoir suffisamment de crédits avant de lancer un cours.",
    categorie: "Cours et Formations",
    formateur: "Martin Dubois"
  },
  {
    id: "faq-5",
    question: "Que faire si un cours ne se charge pas ?",
    reponse: "Vérifiez votre connexion internet, videz le cache de votre navigateur, et réessayez. Si le problème persiste, contactez le support technique avec une capture d'écran de l'erreur.",
    categorie: "Cours et Formations",
    formateur: "Sarah Johnson"
  },
  {
    id: "faq-6",
    question: "Puis-je reprendre un cours là où je me suis arrêté ?",
    reponse: "Oui, la plateforme sauvegarde automatiquement votre progression. Lorsque vous relancez un cours, vous reprenez exactement où vous vous êtes arrêté.",
    categorie: "Cours et Formations",
    formateur: "Martin Dubois"
  },
  {
    id: "faq-7",
    question: "Combien de temps ai-je pour terminer un cours ?",
    reponse: "Cela dépend de votre formation. Consultez les détails de chaque cours pour connaître la durée d'accès. En général, vous avez accès au cours tant que votre formation est active.",
    categorie: "Cours et Formations",
    formateur: "Sarah Johnson"
  },
  {
    id: "faq-8",
    question: "Comment savoir si j'ai terminé un cours ?",
    reponse: "Votre progression est visible dans 'Mes Cours'. Un indicateur de progression vous montre le pourcentage complété. Une fois à 100%, vous avez terminé tous les modules du cours.",
    categorie: "Cours et Formations",
    formateur: "Martin Dubois"
  },
  
  // Catégorie: Cours en Live
  {
    id: "faq-9",
    question: "Comment m'inscrire à un cours en live ?",
    reponse: "Allez dans 'Cours en Live' depuis votre navigation. Vous verrez tous les cours programmés. Cliquez sur 'S'inscrire' pour réserver votre place. Vous recevrez un rappel avant le début du cours.",
    categorie: "Cours en Live",
    formateur: "Sarah Johnson"
  },
  {
    id: "faq-10",
    question: "Que faire si je rate un cours en live ?",
    reponse: "Si vous avez manqué un cours en live, contactez votre formateur. Certains cours peuvent être enregistrés et disponibles en replay. Sinon, vous pouvez vous inscrire à la prochaine session.",
    categorie: "Cours en Live",
    formateur: "Martin Dubois"
  },
  {
    id: "faq-11",
    question: "Les cours en live sont-ils obligatoires ?",
    reponse: "Cela dépend de votre formation. Certains cours en live sont obligatoires, d'autres sont optionnels. Consultez les détails de votre formation pour plus d'informations.",
    categorie: "Cours en Live",
    formateur: "Sarah Johnson"
  },
  
  // Catégorie: Quiz et Évaluations
  {
    id: "faq-12",
    question: "Combien de fois puis-je passer un quiz ?",
    reponse: "Le nombre de tentatives autorisées dépend de chaque quiz. Consultez les instructions avant de commencer. En général, vous avez plusieurs tentatives pour améliorer votre score.",
    categorie: "Quiz et Évaluations",
    formateur: "Martin Dubois"
  },
  {
    id: "faq-13",
    question: "Comment voir mes résultats de quiz ?",
    reponse: "Après avoir terminé un quiz, vos résultats s'affichent immédiatement. Vous pouvez également consulter l'historique de vos quiz depuis la section 'Quiz' de votre tableau de bord.",
    categorie: "Quiz et Évaluations",
    formateur: "Sarah Johnson"
  },
  {
    id: "faq-14",
    question: "Que faire si je perds ma connexion pendant un quiz ?",
    reponse: "Si vous perdez la connexion, reconnectez-vous rapidement. Votre progression peut être sauvegardée selon le type de quiz. Contactez votre formateur si vous rencontrez des problèmes.",
    categorie: "Quiz et Évaluations",
    formateur: "Martin Dubois"
  },
  
  // Catégorie: Crédits et Paiement
  {
    id: "faq-15",
    question: "Comment obtenir des crédits pour suivre des cours ?",
    reponse: "Les crédits sont gérés par votre collectivité locale. Contactez l'administrateur de votre collectivité pour obtenir des crédits supplémentaires. Vous pouvez également consulter votre solde dans votre tableau de bord.",
    categorie: "Crédits et Paiement",
    formateur: "Équipe Support"
  },
  {
    id: "faq-16",
    question: "Combien de crédits coûte un cours ?",
    reponse: "Le coût en crédits varie selon le cours. Consultez les détails de chaque cours pour connaître le nombre de crédits requis. Les cours plus longs ou spécialisés coûtent généralement plus de crédits.",
    categorie: "Crédits et Paiement",
    formateur: "Équipe Support"
  },
  {
    id: "faq-17",
    question: "Mes crédits expirent-ils ?",
    reponse: "La validité des crédits dépend de votre contrat avec la collectivité locale. Consultez votre administrateur pour connaître la durée de validité de vos crédits.",
    categorie: "Crédits et Paiement",
    formateur: "Équipe Support"
  },
  
  // Catégorie: Problèmes Techniques
  {
    id: "faq-18",
    question: "Quels navigateurs sont compatibles avec la plateforme ?",
    reponse: "La plateforme fonctionne sur les navigateurs modernes : Chrome, Firefox, Safari, et Edge (versions récentes). Assurez-vous d'avoir la dernière version de votre navigateur pour une expérience optimale.",
    categorie: "Problèmes Techniques",
    formateur: "Équipe Support"
  },
  {
    id: "faq-19",
    question: "Puis-je suivre des cours sur mobile ?",
    reponse: "Oui, la plateforme est responsive et fonctionne sur les appareils mobiles. Cependant, pour une meilleure expérience, notamment pour les quiz et les cours en live, nous recommandons l'utilisation d'un ordinateur ou d'une tablette.",
    categorie: "Problèmes Techniques",
    formateur: "Équipe Support"
  },
  {
    id: "faq-20",
    question: "Comment signaler un bug ou un problème technique ?",
    reponse: "Utilisez le formulaire de contact en bas de cette page pour signaler un problème. Décrivez précisément le problème, incluez une capture d'écran si possible, et notre équipe technique vous répondra rapidement.",
    categorie: "Problèmes Techniques",
    formateur: "Équipe Support"
  },
  
  // Catégorie: Certificats et Attestations
  {
    id: "faq-21",
    question: "Vais-je recevoir un certificat après avoir terminé une formation ?",
    reponse: "Oui, une fois que vous avez terminé tous les cours et quiz d'une formation avec succès, vous recevrez automatiquement un certificat de complétion. Vous pouvez le télécharger depuis votre tableau de bord.",
    categorie: "Certificats et Attestations",
    formateur: "Sarah Johnson"
  },
  {
    id: "faq-22",
    question: "Comment télécharger mon certificat ?",
    reponse: "Allez dans votre tableau de bord, section 'Mes Formations'. Pour chaque formation complétée, vous verrez un bouton 'Télécharger le certificat'. Cliquez dessus pour obtenir votre certificat au format PDF.",
    categorie: "Certificats et Attestations",
    formateur: "Martin Dubois"
  }
];

const categories = [
  { id: "all", label: "Toutes les catégories", icon: HelpCircle },
  { id: "Inscription et Connexion", label: "Inscription et Connexion", icon: User },
  { id: "Cours et Formations", label: "Cours et Formations", icon: BookOpen },
  { id: "Cours en Live", label: "Cours en Live", icon: Video },
  { id: "Quiz et Évaluations", label: "Quiz et Évaluations", icon: FileQuestion },
  { id: "Crédits et Paiement", label: "Crédits et Paiement", icon: CreditCard },
  { id: "Problèmes Techniques", label: "Problèmes Techniques", icon: MessageCircle },
  { id: "Certificats et Attestations", label: "Certificats et Attestations", icon: BookOpen },
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [contactForm, setContactForm] = useState({ email: "", sujet: "", message: "" });

  const filteredFAQs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.reponse.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || faq.categorie === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleSubmitContact = () => {
    if (!contactForm.email || !contactForm.sujet || !contactForm.message) {
      alert("Veuillez remplir tous les champs du formulaire de contact.");
      return;
    }
    alert("Votre message a été envoyé. Notre équipe vous répondra dans les plus brefs délais.");
    setContactForm({ email: "", sujet: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Centre d'Aide & FAQ
          </h1>
          <p className="text-muted-foreground">
            Trouvez rapidement les réponses aux questions les plus fréquentes
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredFAQs.length} question{filteredFAQs.length > 1 ? "s" : ""} trouvée{filteredFAQs.length > 1 ? "s" : ""}
        </div>

        {/* FAQ Accordion */}
        <Card>
          <CardHeader>
            <CardTitle>Questions Fréquentes</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune question trouvée pour votre recherche.</p>
                <p className="text-sm mt-2">Essayez de modifier vos critères de recherche.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="flex-1">{faq.question}</span>
                        <Badge variant="outline" className="ml-2 shrink-0">
                          {faq.categorie}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm leading-relaxed">{faq.reponse}</p>
                        </div>
                        {faq.formateur && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>Réponse de : <strong>{faq.formateur}</strong></span>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contacter le Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas trouvé la réponse à votre question ? Contactez notre équipe de support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Votre email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              />
              <Input
                placeholder="Sujet"
                value={contactForm.sujet}
                onChange={(e) => setContactForm({ ...contactForm, sujet: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Décrivez votre problème ou question en détail..."
              rows={5}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            />
            <div className="flex justify-end">
              <Button className="bg-gradient-primary" onClick={handleSubmitContact}>
                Envoyer le message
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


